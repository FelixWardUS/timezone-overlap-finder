const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^(\d{2}):(\d{2})$/;
const MINUTES_PER_DAY = 24 * 60;
const MAX_FIXED_POINT_ITERATIONS = 8;

function parseDate(value) {
  const match = DATE_RE.exec(value);
  if (!match) {
    throw new Error(`Invalid date: ${value}`);
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function parseTime(value) {
  const match = TIME_RE.exec(value);
  if (!match) {
    throw new Error(`Invalid time: ${value}`);
  }

  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
  };
}

function addDays(dateString, days) {
  const { year, month, day } = parseDate(dateString);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function getZonedParts(utcMs, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    calendar: 'iso8601',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(new Date(utcMs));
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function getTimeZoneOffsetMs(utcMs, timeZone) {
  const parts = getZonedParts(utcMs, timeZone);
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second, 0) - utcMs;
}

function sameLocalDateTime(parts, date, time) {
  const { year, month, day } = parseDate(date);
  const { hour, minute } = parseTime(time);

  return (
    parts.year === year &&
    parts.month === month &&
    parts.day === day &&
    parts.hour === hour &&
    parts.minute === minute
  );
}

function localDateTimeToUtcMs(date, timeZone, time) {
  const { year, month, day } = parseDate(date);
  const { hour, minute } = parseTime(time);
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  let utcMs = localAsUtc;

  // Iterate until the guessed UTC instant stabilizes for the zone offset.
  for (let i = 0; i < MAX_FIXED_POINT_ITERATIONS; i += 1) {
    const offsetMs = getTimeZoneOffsetMs(utcMs, timeZone);
    const nextUtcMs = localAsUtc - offsetMs;
    if (nextUtcMs === utcMs) {
      const resolved = getZonedParts(utcMs, timeZone);
      if (!sameLocalDateTime(resolved, date, time)) {
        throw new Error(`Invalid local time: ${date} ${time} in ${timeZone}`);
      }
      return utcMs;
    }
    utcMs = nextUtcMs;
  }

  const resolved = getZonedParts(utcMs, timeZone);
  if (!sameLocalDateTime(resolved, date, time)) {
    throw new Error(`Invalid local time: ${date} ${time} in ${timeZone}`);
  }
  return utcMs;
}

export function buildAbsoluteRange({ date, timeZone, startTime, endTime }) {
  if (startTime === endTime) {
    throw new Error('startTime and endTime must differ');
  }

  const overnight = endTime < startTime;
  const startMs = localDateTimeToUtcMs(date, timeZone, startTime);
  const endDate = overnight ? addDays(date, 1) : date;
  const endMs = localDateTimeToUtcMs(endDate, timeZone, endTime);

  return { startMs, endMs, overnight };
}

export function intersectRanges(ranges) {
  if (ranges.length === 0) {
    throw new Error('ranges must not be empty');
  }

  const startMs = Math.max(...ranges.map((range) => range.startMs));
  const endMs = Math.min(...ranges.map((range) => range.endMs));

  if (endMs <= startMs) {
    return null;
  }

  return { startMs, endMs };
}

export function buildWrappedSegments(range, timeZone) {
  const start = getZonedParts(range.startMs, timeZone);
  const end = getZonedParts(range.endMs, timeZone);
  const startDate = `${start.year}-${String(start.month).padStart(2, '0')}-${String(start.day).padStart(2, '0')}`;
  const endDate = `${end.year}-${String(end.month).padStart(2, '0')}-${String(end.day).padStart(2, '0')}`;
  const startMinutes = start.hour * 60 + start.minute;
  const endMinutes = end.hour * 60 + end.minute;

  if (startDate === endDate && endMinutes < startMinutes) {
    const elapsedMinutes = Math.round((range.endMs - range.startMs) / 60000);
    return [{ startMinutes, endMinutes: startMinutes + elapsedMinutes }];
  }

  if (startDate === endDate) {
    return [{ startMinutes, endMinutes }];
  }

  const segments = [{ startMinutes, endMinutes: MINUTES_PER_DAY }];
  let currentDate = addDays(startDate, 1);

  while (currentDate < endDate) {
    segments.push({ startMinutes: 0, endMinutes: MINUTES_PER_DAY });
    currentDate = addDays(currentDate, 1);
  }

  if (endMinutes === 0) {
    return segments;
  }

  segments.push({ startMinutes: 0, endMinutes });
  return segments;
}

function formatTime(value, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    calendar: 'iso8601',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(value));
}

function hasRequiredEntryFields(entry) {
  return Boolean(entry && entry.date && entry.timeZone && entry.startTime && entry.endTime);
}

export function getSupportedTimeZones() {
  if (typeof Intl.supportedValuesOf !== 'function') {
    return [];
  }

  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return [];
  }
}

export function formatTimeZoneLabel(timeZone) {
  return timeZone.replaceAll('/', ' / ').replaceAll('_', ' ');
}

export function formatRangeForZone(range, timeZone) {
  const start = formatTime(range.startMs, timeZone);
  const end = formatTime(range.endMs, timeZone);

  return {
    start,
    end,
    label: `${start} - ${end}`,
  };
}

export function computeOverlap(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return { status: 'incomplete' };
  }

  for (const entry of entries) {
    if (!hasRequiredEntryFields(entry)) {
      return { status: 'incomplete' };
    }
  }

  const ranges = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    try {
      ranges.push(buildAbsoluteRange(entry));
    } catch {
      return { status: 'invalid', invalidIndex: index };
    }
  }

  const overlap = intersectRanges(ranges);
  if (overlap === null) {
    return { status: 'no-overlap', overlap: null };
  }

  return { status: 'ready', overlap };
}
