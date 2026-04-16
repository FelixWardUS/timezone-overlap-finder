const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^(\d{2}):(\d{2})$/;
const MINUTES_PER_DAY = 24 * 60;
const MAX_FIXED_POINT_ITERATIONS = 8;
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FALLBACK_TIME_ZONES = [
  'Africa/Abidjan',
  'Africa/Accra',
  'Africa/Addis_Ababa',
  'Africa/Algiers',
  'Africa/Asmera',
  'Africa/Bamako',
  'Africa/Bangui',
  'Africa/Banjul',
  'Africa/Bissau',
  'Africa/Blantyre',
  'Africa/Brazzaville',
  'Africa/Bujumbura',
  'Africa/Cairo',
  'Africa/Casablanca',
  'Africa/Ceuta',
  'Africa/Conakry',
  'Africa/Dakar',
  'Africa/Dar_es_Salaam',
  'Africa/Djibouti',
  'Africa/Douala',
  'Africa/El_Aaiun',
  'Africa/Freetown',
  'Africa/Gaborone',
  'Africa/Harare',
  'Africa/Johannesburg',
  'Africa/Juba',
  'Africa/Kampala',
  'Africa/Khartoum',
  'Africa/Kigali',
  'Africa/Kinshasa',
  'Africa/Lagos',
  'Africa/Libreville',
  'Africa/Lome',
  'Africa/Luanda',
  'Africa/Lubumbashi',
  'Africa/Lusaka',
  'Africa/Malabo',
  'Africa/Maputo',
  'Africa/Maseru',
  'Africa/Mbabane',
  'Africa/Mogadishu',
  'Africa/Monrovia',
  'Africa/Nairobi',
  'Africa/Ndjamena',
  'Africa/Niamey',
  'Africa/Nouakchott',
  'Africa/Ouagadougou',
  'Africa/Porto-Novo',
  'Africa/Sao_Tome',
  'Africa/Tripoli',
  'Africa/Tunis',
  'Africa/Windhoek',
  'America/Adak',
  'America/Anchorage',
  'America/Anguilla',
  'America/Antigua',
  'America/Araguaina',
  'America/Argentina/La_Rioja',
  'America/Argentina/Rio_Gallegos',
  'America/Argentina/Salta',
  'America/Argentina/San_Juan',
  'America/Argentina/San_Luis',
  'America/Argentina/Tucuman',
  'America/Argentina/Ushuaia',
  'America/Aruba',
  'America/Asuncion',
  'America/Bahia',
  'America/Bahia_Banderas',
  'America/Barbados',
  'America/Belem',
  'America/Belize',
  'America/Blanc-Sablon',
  'America/Boa_Vista',
  'America/Bogota',
  'America/Boise',
  'America/Buenos_Aires',
  'America/Cambridge_Bay',
  'America/Campo_Grande',
  'America/Cancun',
  'America/Caracas',
  'America/Catamarca',
  'America/Cayenne',
  'America/Cayman',
  'America/Chicago',
  'America/Chihuahua',
  'America/Ciudad_Juarez',
  'America/Coral_Harbour',
  'America/Cordoba',
  'America/Costa_Rica',
  'America/Coyhaique',
  'America/Creston',
  'America/Cuiaba',
  'America/Curacao',
  'America/Danmarkshavn',
  'America/Dawson',
  'America/Dawson_Creek',
  'America/Denver',
  'America/Detroit',
  'America/Dominica',
  'America/Edmonton',
  'America/Eirunepe',
  'America/El_Salvador',
  'America/Fort_Nelson',
  'America/Fortaleza',
  'America/Glace_Bay',
  'America/Godthab',
  'America/Goose_Bay',
  'America/Grand_Turk',
  'America/Grenada',
  'America/Guadeloupe',
  'America/Guatemala',
  'America/Guayaquil',
  'America/Guyana',
  'America/Halifax',
  'America/Havana',
  'America/Hermosillo',
  'America/Indiana/Knox',
  'America/Indiana/Marengo',
  'America/Indiana/Petersburg',
  'America/Indiana/Tell_City',
  'America/Indiana/Vevay',
  'America/Indiana/Vincennes',
  'America/Indiana/Winamac',
  'America/Indianapolis',
  'America/Inuvik',
  'America/Iqaluit',
  'America/Jamaica',
  'America/Jujuy',
  'America/Juneau',
  'America/Kentucky/Monticello',
  'America/Kralendijk',
  'America/La_Paz',
  'America/Lima',
  'America/Los_Angeles',
  'America/Louisville',
  'America/Lower_Princes',
  'America/Maceio',
  'America/Managua',
  'America/Manaus',
  'America/Marigot',
  'America/Martinique',
  'America/Matamoros',
  'America/Mazatlan',
  'America/Mendoza',
  'America/Menominee',
  'America/Merida',
  'America/Metlakatla',
  'America/Mexico_City',
  'America/Miquelon',
  'America/Moncton',
  'America/Monterrey',
  'America/Montevideo',
  'America/Montserrat',
  'America/Nassau',
  'America/New_York',
  'America/Nome',
  'America/Noronha',
  'America/North_Dakota/Beulah',
  'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem',
  'America/Ojinaga',
  'America/Panama',
  'America/Paramaribo',
  'America/Phoenix',
  'America/Port-au-Prince',
  'America/Port_of_Spain',
  'America/Porto_Velho',
  'America/Puerto_Rico',
  'America/Punta_Arenas',
  'America/Rankin_Inlet',
  'America/Recife',
  'America/Regina',
  'America/Resolute',
  'America/Rio_Branco',
  'America/Santarem',
  'America/Santiago',
  'America/Santo_Domingo',
  'America/Sao_Paulo',
  'America/Scoresbysund',
  'America/Sitka',
  'America/St_Barthelemy',
  'America/St_Johns',
  'America/St_Kitts',
  'America/St_Lucia',
  'America/St_Thomas',
  'America/St_Vincent',
  'America/Swift_Current',
  'America/Tegucigalpa',
  'America/Thule',
  'America/Tijuana',
  'America/Toronto',
  'America/Tortola',
  'America/Vancouver',
  'America/Whitehorse',
  'America/Winnipeg',
  'America/Yakutat',
  'Antarctica/Casey',
  'Antarctica/Davis',
  'Antarctica/DumontDUrville',
  'Antarctica/Macquarie',
  'Antarctica/Mawson',
  'Antarctica/McMurdo',
  'Antarctica/Palmer',
  'Antarctica/Rothera',
  'Antarctica/Syowa',
  'Antarctica/Troll',
  'Antarctica/Vostok',
  'Arctic/Longyearbyen',
  'Asia/Aden',
  'Asia/Almaty',
  'Asia/Amman',
  'Asia/Anadyr',
  'Asia/Aqtau',
  'Asia/Aqtobe',
  'Asia/Ashgabat',
  'Asia/Atyrau',
  'Asia/Baghdad',
  'Asia/Bahrain',
  'Asia/Baku',
  'Asia/Bangkok',
  'Asia/Barnaul',
  'Asia/Beirut',
  'Asia/Bishkek',
  'Asia/Brunei',
  'Asia/Calcutta',
  'Asia/Chita',
  'Asia/Colombo',
  'Asia/Damascus',
  'Asia/Dhaka',
  'Asia/Dili',
  'Asia/Dubai',
  'Asia/Dushanbe',
  'Asia/Famagusta',
  'Asia/Gaza',
  'Asia/Hebron',
  'Asia/Hong_Kong',
  'Asia/Hovd',
  'Asia/Irkutsk',
  'Asia/Jakarta',
  'Asia/Jayapura',
  'Asia/Jerusalem',
  'Asia/Kabul',
  'Asia/Kamchatka',
  'Asia/Karachi',
  'Asia/Katmandu',
  'Asia/Khandyga',
  'Asia/Krasnoyarsk',
  'Asia/Kuala_Lumpur',
  'Asia/Kuching',
  'Asia/Kuwait',
  'Asia/Macau',
  'Asia/Magadan',
  'Asia/Makassar',
  'Asia/Manila',
  'Asia/Muscat',
  'Asia/Nicosia',
  'Asia/Novokuznetsk',
  'Asia/Novosibirsk',
  'Asia/Omsk',
  'Asia/Oral',
  'Asia/Phnom_Penh',
  'Asia/Pontianak',
  'Asia/Pyongyang',
  'Asia/Qatar',
  'Asia/Qostanay',
  'Asia/Qyzylorda',
  'Asia/Rangoon',
  'Asia/Riyadh',
  'Asia/Saigon',
  'Asia/Sakhalin',
  'Asia/Samarkand',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Srednekolymsk',
  'Asia/Taipei',
  'Asia/Tashkent',
  'Asia/Tbilisi',
  'Asia/Tehran',
  'Asia/Thimphu',
  'Asia/Tokyo',
  'Asia/Tomsk',
  'Asia/Ulaanbaatar',
  'Asia/Urumqi',
  'Asia/Ust-Nera',
  'Asia/Vientiane',
  'Asia/Vladivostok',
  'Asia/Yakutsk',
  'Asia/Yekaterinburg',
  'Asia/Yerevan',
  'Atlantic/Azores',
  'Atlantic/Bermuda',
  'Atlantic/Canary',
  'Atlantic/Cape_Verde',
  'Atlantic/Faeroe',
  'Atlantic/Madeira',
  'Atlantic/Reykjavik',
  'Atlantic/South_Georgia',
  'Atlantic/St_Helena',
  'Atlantic/Stanley',
  'Australia/Adelaide',
  'Australia/Brisbane',
  'Australia/Broken_Hill',
  'Australia/Darwin',
  'Australia/Eucla',
  'Australia/Hobart',
  'Australia/Lindeman',
  'Australia/Lord_Howe',
  'Australia/Melbourne',
  'Australia/Perth',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Andorra',
  'Europe/Astrakhan',
  'Europe/Athens',
  'Europe/Belgrade',
  'Europe/Berlin',
  'Europe/Bratislava',
  'Europe/Brussels',
  'Europe/Bucharest',
  'Europe/Budapest',
  'Europe/Busingen',
  'Europe/Chisinau',
  'Europe/Copenhagen',
  'Europe/Dublin',
  'Europe/Gibraltar',
  'Europe/Guernsey',
  'Europe/Helsinki',
  'Europe/Isle_of_Man',
  'Europe/Istanbul',
  'Europe/Jersey',
  'Europe/Kaliningrad',
  'Europe/Kiev',
  'Europe/Kirov',
  'Europe/Lisbon',
  'Europe/Ljubljana',
  'Europe/London',
  'Europe/Luxembourg',
  'Europe/Madrid',
  'Europe/Malta',
  'Europe/Mariehamn',
  'Europe/Minsk',
  'Europe/Monaco',
  'Europe/Moscow',
  'Europe/Oslo',
  'Europe/Paris',
  'Europe/Podgorica',
  'Europe/Prague',
  'Europe/Riga',
  'Europe/Rome',
  'Europe/Samara',
  'Europe/San_Marino',
  'Europe/Sarajevo',
  'Europe/Saratov',
  'Europe/Simferopol',
  'Europe/Skopje',
  'Europe/Sofia',
  'Europe/Stockholm',
  'Europe/Tallinn',
  'Europe/Tirane',
  'Europe/Ulyanovsk',
  'Europe/Vaduz',
  'Europe/Vatican',
  'Europe/Vienna',
  'Europe/Vilnius',
  'Europe/Volgograd',
  'Europe/Warsaw',
  'Europe/Zagreb',
  'Europe/Zurich',
  'Indian/Antananarivo',
  'Indian/Chagos',
  'Indian/Christmas',
  'Indian/Cocos',
  'Indian/Comoro',
  'Indian/Kerguelen',
  'Indian/Mahe',
  'Indian/Maldives',
  'Indian/Mauritius',
  'Indian/Mayotte',
  'Indian/Reunion',
  'Pacific/Apia',
  'Pacific/Auckland',
  'Pacific/Bougainville',
  'Pacific/Chatham',
  'Pacific/Easter',
  'Pacific/Efate',
  'Pacific/Enderbury',
  'Pacific/Fakaofo',
  'Pacific/Fiji',
  'Pacific/Funafuti',
  'Pacific/Galapagos',
  'Pacific/Gambier',
  'Pacific/Guadalcanal',
  'Pacific/Guam',
  'Pacific/Honolulu',
  'Pacific/Kiritimati',
  'Pacific/Kosrae',
  'Pacific/Kwajalein',
  'Pacific/Majuro',
  'Pacific/Marquesas',
  'Pacific/Midway',
  'Pacific/Nauru',
  'Pacific/Niue',
  'Pacific/Norfolk',
  'Pacific/Noumea',
  'Pacific/Pago_Pago',
  'Pacific/Palau',
  'Pacific/Pitcairn',
  'Pacific/Ponape',
  'Pacific/Port_Moresby',
  'Pacific/Rarotonga',
  'Pacific/Saipan',
  'Pacific/Tahiti',
  'Pacific/Tarawa',
  'Pacific/Tongatapu',
  'Pacific/Truk',
  'Pacific/Wake',
  'Pacific/Wallis',
];

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

function formatMonthDay(value, timeZone) {
  const parts = getZonedParts(value, timeZone);
  return `${MONTH_LABELS[parts.month - 1]} ${parts.day}`;
}

function canUseTimeZone(timeZone) {
  try {
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      calendar: 'iso8601',
    }).format(new Date(0));
    return true;
  } catch {
    return false;
  }
}

function hasRequiredEntryFields(entry) {
  return Boolean(entry && entry.date && entry.timeZone && entry.startTime && entry.endTime);
}

export function getSupportedTimeZones() {
  if (typeof Intl.supportedValuesOf !== 'function') {
    return FALLBACK_TIME_ZONES.filter(canUseTimeZone);
  }

  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return FALLBACK_TIME_ZONES.filter(canUseTimeZone);
  }
}

export function formatTimeZoneLabel(timeZone) {
  return timeZone.replaceAll('/', ' / ').replaceAll('_', ' ');
}

export function formatRangeForZone(range, timeZone) {
  const start = formatTime(range.startMs, timeZone);
  const end = formatTime(range.endMs, timeZone);
  const startParts = getZonedParts(range.startMs, timeZone);
  const endParts = getZonedParts(range.endMs, timeZone);
  const spansLocalDates =
    startParts.year !== endParts.year || startParts.month !== endParts.month || startParts.day !== endParts.day;
  const label = spansLocalDates
    ? `${formatMonthDay(range.startMs, timeZone)}, ${start} - ${formatMonthDay(range.endMs, timeZone)}, ${end}`
    : `${start} - ${end}`;

  return {
    start,
    end,
    label,
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
