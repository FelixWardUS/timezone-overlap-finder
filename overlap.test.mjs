import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAbsoluteRange,
  buildWrappedSegments,
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
    { startMinutes: 90, endMinutes: 75 },
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
