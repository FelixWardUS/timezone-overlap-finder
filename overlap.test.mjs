import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAbsoluteRange,
  buildWrappedSegments,
  computeOverlap,
  formatRangeForZone,
  formatTimeZoneLabel,
  getSupportedTimeZones,
  intersectRanges,
} from './overlap.mjs';

test('buildAbsoluteRange converts New York office hours to UTC in winter', () => {
  const range = buildAbsoluteRange({
    date: '2026-01-15',
    timeZone: 'America/New_York',
    startTime: '09:00',
    endTime: '17:00',
  });

  assert.deepEqual(
    {
      startIso: new Date(range.startMs).toISOString(),
      endIso: new Date(range.endMs).toISOString(),
      overnight: range.overnight,
    },
    {
      startIso: '2026-01-15T14:00:00.000Z',
      endIso: '2026-01-15T22:00:00.000Z',
      overnight: false,
    },
  );
});

test('buildAbsoluteRange uses date-sensitive offsets for New York', () => {
  const winter = buildAbsoluteRange({
    date: '2026-01-15',
    timeZone: 'America/New_York',
    startTime: '09:00',
    endTime: '10:00',
  });
  const summer = buildAbsoluteRange({
    date: '2026-07-15',
    timeZone: 'America/New_York',
    startTime: '09:00',
    endTime: '10:00',
  });

  assert.equal(new Date(winter.startMs).toISOString(), '2026-01-15T14:00:00.000Z');
  assert.equal(new Date(summer.startMs).toISOString(), '2026-07-15T13:00:00.000Z');
});

test('buildAbsoluteRange pushes overnight Tokyo schedules into the next day', () => {
  const range = buildAbsoluteRange({
    date: '2026-01-15',
    timeZone: 'Asia/Tokyo',
    startTime: '22:00',
    endTime: '06:00',
  });

  assert.equal(new Date(range.startMs).toISOString(), '2026-01-15T13:00:00.000Z');
  assert.equal(new Date(range.endMs).toISOString(), '2026-01-15T21:00:00.000Z');
  assert.equal(range.overnight, true);
});

test('getSupportedTimeZones returns a list when supported and falls back to empty otherwise', () => {
  const zones = getSupportedTimeZones();
  assert.ok(Array.isArray(zones));
});

test('getSupportedTimeZones falls back to a maintained static IANA list', () => {
  const originalSupportedValuesOf = Intl.supportedValuesOf;

  try {
    Intl.supportedValuesOf = undefined;
    const zones = getSupportedTimeZones();

    assert.ok(zones.length > 100);
    assert.ok(zones.includes('America/New_York'));
    assert.ok(zones.includes('Europe/London'));
    assert.ok(zones.includes('Asia/Tokyo'));
    assert.ok(zones.includes('Australia/Sydney'));
  } finally {
    Intl.supportedValuesOf = originalSupportedValuesOf;
  }
});

test('getSupportedTimeZones fallback only returns zones usable by this runtime', () => {
  const originalSupportedValuesOf = Intl.supportedValuesOf;
  const originalDateTimeFormat = Intl.DateTimeFormat;

  try {
    Intl.supportedValuesOf = undefined;
    Intl.DateTimeFormat = function DateTimeFormatProxy(locale, options = {}) {
      if (options.timeZone === 'America/New_York') {
        throw new RangeError('Unsupported time zone specified');
      }

      return new originalDateTimeFormat(locale, options);
    };
    Intl.DateTimeFormat.prototype = originalDateTimeFormat.prototype;

    const zones = getSupportedTimeZones();

    assert.ok(!zones.includes('America/New_York'));
    assert.ok(zones.includes('Europe/London'));
    assert.doesNotThrow(() => {
      for (const zone of zones) {
        new originalDateTimeFormat('en-US', { timeZone: zone }).format(new Date('2026-01-15T12:00:00.000Z'));
      }
    });
  } finally {
    Intl.supportedValuesOf = originalSupportedValuesOf;
    Intl.DateTimeFormat = originalDateTimeFormat;
  }
});

test('formatTimeZoneLabel makes zone identifiers easier to read', () => {
  assert.equal(formatTimeZoneLabel('America/New_York'), 'America / New York');
});

test('formatRangeForZone formats a range label in the requested zone', () => {
  const formatted = formatRangeForZone(
    {
      startMs: Date.parse('2026-01-15T14:00:00.000Z'),
      endMs: Date.parse('2026-01-15T17:00:00.000Z'),
    },
    'Europe/London',
  );

  assert.deepEqual(formatted, {
    start: '2:00 PM',
    end: '5:00 PM',
    label: '2:00 PM - 5:00 PM',
  });
});

test('formatRangeForZone adds date context when local dates differ', () => {
  const formatted = formatRangeForZone(
    {
      startMs: Date.parse('2026-01-15T13:00:00.000Z'),
      endMs: Date.parse('2026-01-15T21:00:00.000Z'),
    },
    'Asia/Tokyo',
  );

  assert.deepEqual(formatted, {
    start: '10:00 PM',
    end: '6:00 AM',
    label: 'Jan 15, 10:00 PM - Jan 16, 6:00 AM',
  });
});

test('formatRangeForZone uses the requested non-English locale for displayed ranges', () => {
  const formatted = formatRangeForZone(
    {
      startMs: Date.parse('2026-01-15T13:00:00.000Z'),
      endMs: Date.parse('2026-01-15T21:00:00.000Z'),
    },
    'Asia/Tokyo',
    'ja-JP',
  );

  assert.doesNotMatch(formatted.label, /\b(?:Jan|AM|PM)\b/);
  assert.match(formatted.label, /月/);
});

test('intersectRanges returns only the shared portion of every range', () => {
  const overlap = intersectRanges([
    { startMs: 100, endMs: 200 },
    { startMs: 150, endMs: 300 },
    { startMs: 140, endMs: 180 },
  ]);

  assert.deepEqual(overlap, { startMs: 150, endMs: 180 });
});

test('intersectRanges returns null when ranges do not overlap', () => {
  const overlap = intersectRanges([
    { startMs: 100, endMs: 120 },
    { startMs: 150, endMs: 200 },
  ]);

  assert.equal(overlap, null);
});

test('intersectRanges returns null when ranges only touch at the boundary', () => {
  const overlap = intersectRanges([
    { startMs: 100, endMs: 150 },
    { startMs: 150, endMs: 200 },
  ]);

  assert.equal(overlap, null);
});

test('buildWrappedSegments splits overnight display bars at midnight', () => {
  const range = {
    startMs: Date.parse('2026-01-15T13:00:00.000Z'),
    endMs: Date.parse('2026-01-15T21:00:00.000Z'),
  };

  assert.deepEqual(buildWrappedSegments(range, 'Asia/Tokyo'), [
    { startMinutes: 1320, endMinutes: 1440 },
    { startMinutes: 0, endMinutes: 360 },
  ]);
});

test('buildWrappedSegments omits a trailing zero-length segment at midnight', () => {
  const range = {
    startMs: Date.parse('2026-01-15T13:00:00.000Z'),
    endMs: Date.parse('2026-01-15T15:00:00.000Z'),
  };

  assert.deepEqual(buildWrappedSegments(range, 'Asia/Tokyo'), [
    { startMinutes: 1320, endMinutes: 1440 },
  ]);
});

test('buildWrappedSegments does not split same-date fall-back clock reversal as midnight wrap', () => {
  const range = {
    startMs: Date.parse('2026-11-01T05:30:00.000Z'),
    endMs: Date.parse('2026-11-01T06:15:00.000Z'),
  };

  assert.deepEqual(buildWrappedSegments(range, 'America/New_York'), [
    { startMinutes: 90, endMinutes: 135 },
  ]);
});

test('buildAbsoluteRange rejects local times that resolve differently', () => {
  assert.throws(
    () =>
      buildAbsoluteRange({
        date: '2026-03-08',
        timeZone: 'America/New_York',
        startTime: '02:30',
        endTime: '03:30',
      }),
    /invalid local time/i,
  );
});

test('computeOverlap returns incomplete when required fields are missing', () => {
  const result = computeOverlap([
    {
      date: '2026-01-15',
      timeZone: 'America/New_York',
      startTime: '09:00',
    },
    {
      date: '2026-01-15',
      timeZone: 'Europe/London',
      startTime: '14:00',
      endTime: '17:00',
    },
  ]);

  assert.deepEqual(result, { status: 'incomplete' });
});

test('computeOverlap returns ready state for New York and London', () => {
  const result = computeOverlap([
    {
      date: '2026-01-15',
      timeZone: 'America/New_York',
      startTime: '09:00',
      endTime: '17:00',
    },
    {
      date: '2026-01-15',
      timeZone: 'Europe/London',
      startTime: '14:00',
      endTime: '17:00',
    },
  ]);

  assert.equal(result.status, 'ready');
  assert.deepEqual(result.overlap, {
    startMs: Date.parse('2026-01-15T14:00:00.000Z'),
    endMs: Date.parse('2026-01-15T17:00:00.000Z'),
  });
  assert.equal(formatRangeForZone(result.overlap, 'Europe/London').label, '2:00 PM - 5:00 PM');
});

test('computeOverlap returns ready state for three overlapping time zones', () => {
  const result = computeOverlap([
    {
      date: '2026-01-15',
      timeZone: 'America/New_York',
      startTime: '09:00',
      endTime: '17:00',
    },
    {
      date: '2026-01-15',
      timeZone: 'Europe/London',
      startTime: '14:00',
      endTime: '20:00',
    },
    {
      date: '2026-01-15',
      timeZone: 'America/Los_Angeles',
      startTime: '06:00',
      endTime: '10:00',
    },
  ]);

  assert.equal(result.status, 'ready');
  assert.deepEqual(result.overlap, {
    startMs: Date.parse('2026-01-15T14:00:00.000Z'),
    endMs: Date.parse('2026-01-15T18:00:00.000Z'),
  });
});

test('single-entry ready overlaps produce the working-hours label contract used by the app', () => {
  const entry = {
    date: '2026-01-15',
    timeZone: 'Asia/Tokyo',
    startTime: '22:00',
    endTime: '06:00',
  };

  const result = computeOverlap([entry]);

  assert.equal(result.status, 'ready');
  assert.equal(formatRangeForZone(result.overlap, entry.timeZone).label, 'Jan 15, 10:00 PM - Jan 16, 6:00 AM');
});

test('computeOverlap returns no-overlap for New York and Tokyo', () => {
  const result = computeOverlap([
    {
      date: '2026-01-15',
      timeZone: 'America/New_York',
      startTime: '09:00',
      endTime: '12:00',
    },
    {
      date: '2026-01-15',
      timeZone: 'Asia/Tokyo',
      startTime: '09:00',
      endTime: '11:00',
    },
  ]);

  assert.deepEqual(result, { status: 'no-overlap', overlap: null });
});

test('computeOverlap returns invalid with the first invalid entry index', () => {
  const result = computeOverlap([
    {
      date: '2026-01-15',
      timeZone: 'America/New_York',
      startTime: '09:00',
      endTime: '09:00',
    },
    {
      date: '2026-01-15',
      timeZone: 'Europe/London',
      startTime: '14:00',
      endTime: '17:00',
    },
  ]);

  assert.deepEqual(result, { status: 'invalid', invalidIndex: 0 });
});
