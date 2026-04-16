import {
  buildWrappedSegments,
  computeOverlap,
  formatRangeForZone,
  formatTimeZoneLabel,
  getSupportedTimeZones,
} from './overlap.mjs';

const DEFAULT_ENTRIES = [
  { timeZone: 'America/New_York', startTime: '09:00', endTime: '17:00' },
  { timeZone: 'Europe/London', startTime: '09:00', endTime: '17:00' },
  { timeZone: 'Asia/Tokyo', startTime: '09:00', endTime: '17:00' },
];
const MINUTES_PER_DAY = 24 * 60;

const controlCard = document.querySelector('.control-card');
const resultsPanel = document.querySelector('#results-panel');
const compatNote = document.querySelector('.compat-note');

if (!controlCard) {
  throw new Error('Missing required control card: .control-card');
}

if (!resultsPanel) {
  throw new Error('Missing required results panel: #results-panel');
}

if (!compatNote) {
  throw new Error('Missing required compatibility note: .compat-note');
}

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10);

let usingFallbackTimeZones = false;
if (typeof Intl.supportedValuesOf !== 'function') {
  usingFallbackTimeZones = true;
} else {
  try {
    Intl.supportedValuesOf('timeZone');
  } catch {
    usingFallbackTimeZones = true;
  }
}

const supportedTimeZones = getSupportedTimeZones();

const state = {
  date: localDate,
  thirdZoneEnabled: false,
  timeZoneOptions: supportedTimeZones,
  entries: DEFAULT_ENTRIES.map((entry) => ({ ...entry })),
};

resultsPanel.setAttribute('aria-live', 'polite');
compatNote.hidden = !usingFallbackTimeZones;
if (usingFallbackTimeZones) {
  compatNote.textContent =
    'This browser does not expose its time zone list, so the picker is using a built-in IANA time zone list.';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return character;
    }
  });
}

function getActiveEntries() {
  const activeCount = state.thirdZoneEnabled ? 3 : 2;
  return state.entries.slice(0, activeCount).map((entry) => ({
    ...entry,
    date: state.date,
  }));
}

function getWorkingRange(entry) {
  const result = computeOverlap([entry]);
  return result.status === 'ready' ? result.overlap : null;
}

function buildScaleLabels() {
  return ['12 AM', '6 AM', '12 PM', '6 PM', '12 AM']
    .map((label) => `<span>${escapeHtml(label)}</span>`)
    .join('');
}

function renderBarSegments(segments, className) {
  return segments
    .map((segment) => {
      const left = (segment.startMinutes / MINUTES_PER_DAY) * 100;
      const width = ((segment.endMinutes - segment.startMinutes) / MINUTES_PER_DAY) * 100;
      return `<span class="${className}" style="left:${left}%;width:${width}%;"></span>`;
    })
    .join('');
}

function renderTimeBar(workingRange, overlapRange, timeZone) {
  const workingSegments = workingRange ? buildWrappedSegments(workingRange, timeZone) : [];
  const overlapSegments = overlapRange ? buildWrappedSegments(overlapRange, timeZone) : [];

  return `
    <div class="time-bar" aria-hidden="true">
      ${renderBarSegments(workingSegments, 'time-bar__segment time-bar__segment--working')}
      ${renderBarSegments(overlapSegments, 'time-bar__segment time-bar__segment--overlap')}
    </div>
    <div class="time-bar__scale">
      ${buildScaleLabels()}
    </div>
  `;
}

function renderZoneOptions(selectedTimeZone) {
  return state.timeZoneOptions
    .map((timeZone) => {
      const selected = timeZone === selectedTimeZone ? ' selected' : '';
      return `<option value="${escapeHtml(timeZone)}"${selected}>${escapeHtml(formatTimeZoneLabel(timeZone))}</option>`;
    })
    .join('');
}

function renderZoneCard(entry, index) {
  const number = index + 1;

  return `
    <article class="time-zone-card">
      <div class="time-zone-card__header">
        <span class="zone-card__label">Time zone ${number}</span>
        <span class="time-zone-card__status" hidden>Needs attention</span>
      </div>
      <div class="field-group">
        <label class="field" for="time-zone-${number}">
          <span>Location</span>
          <select id="time-zone-${number}" name="time-zone-${number}" data-entry-index="${index}" data-field="timeZone">
            ${renderZoneOptions(entry.timeZone)}
          </select>
        </label>
      </div>
      <div class="time-zone-card__times">
        <div class="field-group">
          <label class="field" for="start-time-${number}">
            <span>Start</span>
            <input
              id="start-time-${number}"
              name="start-time-${number}"
              type="time"
              value="${escapeHtml(entry.startTime)}"
              data-entry-index="${index}"
              data-field="startTime"
            />
          </label>
        </div>
        <div class="field-group">
          <label class="field" for="end-time-${number}">
            <span>End</span>
            <input
              id="end-time-${number}"
              name="end-time-${number}"
              type="time"
              value="${escapeHtml(entry.endTime)}"
              data-entry-index="${index}"
              data-field="endTime"
            />
          </label>
        </div>
      </div>
    </article>
  `;
}

function formatWorkingHours(entry, workingRange) {
  if (workingRange) {
    return formatRangeForZone(workingRange, entry.timeZone).label;
  }

  return `${entry.startTime} - ${entry.endTime}`;
}

function getDurationLabel(range) {
  const totalMinutes = Math.round((range.endMs - range.startMs) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}m`;
}

function renderReadyState(entries, overlap) {
  const summary = `${getDurationLabel(overlap)} shared across ${entries.length} time zones on ${state.date}`;
  const rows = entries
    .map((entry) => {
      const workingRange = getWorkingRange(entry);
      const workingHoursLabel = formatWorkingHours(entry, workingRange);
      const overlapLabel = formatRangeForZone(overlap, entry.timeZone).label;

      return `
        <div class="result-row">
          <div class="result-row__zone result-cell">
            <span class="result-cell__label">Time zone</span>
            <strong>${escapeHtml(formatTimeZoneLabel(entry.timeZone))}</strong>
          </div>
          <div class="result-row__hours result-cell">
            <span class="result-cell__label">Working hours</span>
            <span>${escapeHtml(workingHoursLabel)}</span>
          </div>
          <div class="result-row__overlap result-cell">
            <span class="result-cell__label">Overlap</span>
            <span>${escapeHtml(overlapLabel)}</span>
          </div>
          <div class="result-row__bar result-cell">
            <span class="result-cell__label">Day view</span>
            ${renderTimeBar(workingRange, overlap, entry.timeZone)}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div class="result-state result-state--ready">
      <div class="result-summary">
        <p class="eyebrow">Shared hours</p>
        <h3>${escapeHtml(summary)}</h3>
        <p>Each row keeps the local working window visible and highlights the shared overlap.</p>
      </div>
      <div class="result-grid">
        <div class="result-row result-row--header" aria-hidden="true">
          <div>Time zone</div>
          <div>Working hours</div>
          <div>Overlap</div>
          <div>Day view</div>
        </div>
        ${rows}
      </div>
    </div>
  `;
}

function renderResultState(entries, result) {
  switch (result.status) {
    case 'ready':
      return renderReadyState(entries, result.overlap);
    case 'no-overlap':
      return `
        <div class="result-state">
          <p class="eyebrow">No overlap on this date</p>
          <p>Try adjusting one schedule or choose a different day.</p>
        </div>
      `;
    case 'invalid':
      return `
        <div class="result-state">
          <p class="eyebrow">One schedule needs attention</p>
          <p>Check for matching start and end times or a local time that does not exist on this date.</p>
        </div>
      `;
    case 'incomplete':
    default:
      return `
        <div class="result-state">
          <p class="eyebrow">Complete the schedule</p>
          <p>Add a time zone and both working-hour endpoints for every active card.</p>
        </div>
      `;
  }
}

function renderControls() {
  const activeEntries = getActiveEntries();
  controlCard.innerHTML = `
    <div class="field-group">
      <label class="field" for="schedule-date">
        <span>Date</span>
        <input id="schedule-date" name="schedule-date" type="date" value="${escapeHtml(state.date)}" />
      </label>
    </div>
    <div class="zone-grid" aria-label="Time zone cards">
      ${activeEntries.map((entry, index) => renderZoneCard(entry, index)).join('')}
    </div>
    <div class="tool-shell__actions">
      <button class="toggle-button" type="button" data-action="toggle-third-zone">
        ${state.thirdZoneEnabled ? 'Remove the third time zone' : 'Add a third time zone'}
      </button>
    </div>
  `;
}

function syncInvalidState(invalidIndex) {
  const cards = controlCard.querySelectorAll?.('.time-zone-card') ?? [];
  cards.forEach((card, index) => {
    card.classList.toggle('time-zone-card--invalid', invalidIndex === index);

    const status = card.querySelector?.('.time-zone-card__status');
    if (status) {
      status.hidden = invalidIndex !== index;
      status.textContent = 'Needs attention';
    }
  });
}

function renderResults() {
  const activeEntries = getActiveEntries();
  const result = computeOverlap(activeEntries);
  resultsPanel.innerHTML = renderResultState(activeEntries, result);
  syncInvalidState(result.invalidIndex);
}

function updateEntry(index, field, value) {
  state.entries[index] = {
    ...state.entries[index],
    [field]: value,
  };
}

function handleFieldChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (target.id === 'schedule-date') {
    state.date = target.value;
    renderResults();
    return;
  }

  const index = Number(target.dataset.entryIndex);
  const field = target.dataset.field;

  if (Number.isInteger(index) && field) {
    updateEntry(index, field, target.value);
    renderResults();
  }
}

controlCard.addEventListener('input', handleFieldChange);
controlCard.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) {
    return;
  }

  const index = Number(target.dataset.entryIndex);
  const field = target.dataset.field;

  if (Number.isInteger(index) && field) {
    updateEntry(index, field, target.value);
    renderResults();
  }
});

controlCard.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest('[data-action="toggle-third-zone"]');
  if (!button) {
    return;
  }

  state.thirdZoneEnabled = !state.thirdZoneEnabled;
  renderControls();
  renderResults();
});

renderControls();
renderResults();
