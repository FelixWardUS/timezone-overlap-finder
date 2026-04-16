import {
  buildWrappedSegments,
  computeOverlap,
  formatRangeForZone,
  formatTimeZoneLabel,
  getSupportedTimeZones,
} from './overlap.mjs';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getLanguage,
  translate,
} from './ui-copy.mjs';
import { renderLanguageOptions, renderMasthead } from './ui-view.mjs';

const DEFAULT_ENTRIES = [
  { timeZone: 'America/New_York', startTime: '09:00', endTime: '17:00' },
  { timeZone: 'Europe/London', startTime: '09:00', endTime: '17:00' },
  { timeZone: 'Asia/Tokyo', startTime: '09:00', endTime: '17:00' },
];
const MINUTES_PER_DAY = 24 * 60;
const LANGUAGE_STORAGE_KEY = 'timezone-overlap-language';

const mastheadRoot = document.querySelector('#masthead-root');
const controlCard = document.querySelector('.control-card');
const resultsPanel = document.querySelector('#results-panel');
const compatNote = document.querySelector('.compat-note');
const toolEyebrow = document.querySelector('#tool-eyebrow');
const toolHeading = document.querySelector('#tool-heading');
const explanationHeading = document.querySelector('#explanation-heading');
const explanationCopy = document.querySelector('#explanation-copy');

if (!mastheadRoot) {
  throw new Error('Missing required masthead root: #masthead-root');
}

if (!controlCard) {
  throw new Error('Missing required control card: .control-card');
}

if (!resultsPanel) {
  throw new Error('Missing required results panel: #results-panel');
}

if (!compatNote) {
  throw new Error('Missing required compatibility note: .compat-note');
}

if (!toolEyebrow) {
  throw new Error('Missing required tool eyebrow: #tool-eyebrow');
}

if (!toolHeading) {
  throw new Error('Missing required tool heading: #tool-heading');
}

if (!explanationHeading) {
  throw new Error('Missing required explanation heading: #explanation-heading');
}

if (!explanationCopy) {
  throw new Error('Missing required explanation copy: #explanation-copy');
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

function getInitialLanguage() {
  try {
    const storedLanguage = globalThis.localStorage?.getItem(LANGUAGE_STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.some((language) => language.code === storedLanguage)) {
      return storedLanguage;
    }
  } catch {
    // Ignore storage access errors and fall back to English.
  }

  return DEFAULT_LANGUAGE;
}

const state = {
  date: localDate,
  language: getInitialLanguage(),
  thirdZoneEnabled: false,
  timeZoneOptions: supportedTimeZones,
  entries: DEFAULT_ENTRIES.map((entry) => ({ ...entry })),
};

resultsPanel.setAttribute('aria-live', 'polite');

function t(key, variables) {
  return translate(state.language, key, variables);
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

function setDocumentLanguage() {
  const language = getLanguage(state.language);
  document.documentElement.lang = language.code;
  document.documentElement.dir = language.dir;
}

function persistLanguage() {
  try {
    globalThis.localStorage?.setItem(LANGUAGE_STORAGE_KEY, state.language);
  } catch {
    // Ignore storage access errors and continue with in-memory state.
  }
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
  const labels = [
    t('results.scale.midnight'),
    t('results.scale.sixMorning'),
    t('results.scale.noon'),
    t('results.scale.sixEvening'),
    t('results.scale.midnight'),
  ];

  return labels
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
  const zoneLabel = t('fields.zoneNumber', { number });

  return `
    <article class="time-zone-card">
      <div class="time-zone-card__header">
        <span class="zone-card__label">${escapeHtml(zoneLabel)}</span>
        <span class="time-zone-card__status" hidden>${escapeHtml(t('results.invalidStatus'))}</span>
      </div>
      <div class="field-group">
        <label class="field" for="time-zone-${number}">
          <span>${escapeHtml(t('fields.location'))}</span>
          <select id="time-zone-${number}" name="time-zone-${number}" data-entry-index="${index}" data-field="timeZone">
            ${renderZoneOptions(entry.timeZone)}
          </select>
        </label>
      </div>
      <div class="time-zone-card__times">
        <div class="field-group">
          <label class="field" for="start-time-${number}">
            <span>${escapeHtml(t('fields.start'))}</span>
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
            <span>${escapeHtml(t('fields.end'))}</span>
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
  const totalMinutes = Math.round((range.endMs - range.startMs) / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return t('summary.duration.hoursMinutes', { hours, minutes });
  }

  if (hours > 0) {
    return t('summary.duration.hoursOnly', { hours });
  }

  return t('summary.duration.minutesOnly', { minutes });
}

function renderReadyState(entries, overlap) {
  const summary = t('summary.ready', {
    duration: getDurationLabel(overlap),
    count: entries.length,
    date: state.date,
  });
  const rows = entries
    .map((entry) => {
      const workingRange = getWorkingRange(entry);
      const workingHoursLabel = formatWorkingHours(entry, workingRange);
      const overlapLabel = formatRangeForZone(overlap, entry.timeZone).label;

      return `
        <div class="result-row">
          <div class="result-row__zone result-cell">
            <span class="result-cell__label">${escapeHtml(t('results.labels.zone'))}</span>
            <strong>${escapeHtml(formatTimeZoneLabel(entry.timeZone))}</strong>
          </div>
          <div class="result-row__hours result-cell">
            <span class="result-cell__label">${escapeHtml(t('results.labels.workingHours'))}</span>
            <span>${escapeHtml(workingHoursLabel)}</span>
          </div>
          <div class="result-row__overlap result-cell">
            <span class="result-cell__label">${escapeHtml(t('results.labels.overlap'))}</span>
            <span>${escapeHtml(overlapLabel)}</span>
          </div>
          <div class="result-row__bar result-cell">
            <span class="result-cell__label">${escapeHtml(t('results.labels.dayView'))}</span>
            ${renderTimeBar(workingRange, overlap, entry.timeZone)}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div class="result-state result-state--ready">
      <div class="result-summary">
        <p class="eyebrow">${escapeHtml(t('results.readyEyebrow'))}</p>
        <h3>${escapeHtml(summary)}</h3>
        <p>${escapeHtml(t('results.readyNote'))}</p>
      </div>
      <div class="result-grid">
        <div class="result-row result-row--header" aria-hidden="true">
          <div>${escapeHtml(t('results.labels.zone'))}</div>
          <div>${escapeHtml(t('results.labels.workingHours'))}</div>
          <div>${escapeHtml(t('results.labels.overlap'))}</div>
          <div>${escapeHtml(t('results.labels.dayView'))}</div>
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
          <p class="eyebrow">${escapeHtml(t('results.noOverlapTitle'))}</p>
          <p>${escapeHtml(t('results.noOverlapBody'))}</p>
        </div>
      `;
    case 'invalid':
      return `
        <div class="result-state">
          <p class="eyebrow">${escapeHtml(t('results.invalidTitle'))}</p>
          <p>${escapeHtml(t('results.invalidBody'))}</p>
        </div>
      `;
    case 'incomplete':
    default:
      return `
        <div class="result-state">
          <p class="eyebrow">${escapeHtml(t('results.emptyTitle'))}</p>
          <p>${escapeHtml(t('results.emptyBody'))}</p>
        </div>
      `;
  }
}

function renderStaticCopy() {
  const language = getLanguage(state.language);
  const languageOptionsHtml = renderLanguageOptions({
    languages: SUPPORTED_LANGUAGES,
    selectedLanguage: language.code,
  });

  mastheadRoot.innerHTML = renderMasthead({
    language,
    masthead: {
      eyebrow: t('masthead.eyebrow'),
      title: t('masthead.title'),
      copy: t('masthead.copy'),
    },
    chips: ['chips.twoZones', 'chips.threeZones', 'chips.localContext'].map((key) => t(key)),
    languageLabel: t('tool.language'),
    languageOptionsHtml,
  });

  toolEyebrow.textContent = t('tool.eyebrow');
  toolHeading.textContent = t('tool.heading');
  explanationHeading.textContent = t('explanation.heading');
  explanationCopy.textContent = t('explanation.body');
  controlCard.setAttribute('aria-label', t('tool.controlsLabel'));
  resultsPanel.setAttribute('aria-label', t('results.heading'));
  compatNote.hidden = !usingFallbackTimeZones;
  compatNote.textContent = usingFallbackTimeZones ? t('tool.compatNote') : '';
}

function renderControls() {
  const activeEntries = getActiveEntries();
  controlCard.innerHTML = `
    <div class="field-group">
      <label class="field" for="schedule-date">
        <span>${escapeHtml(t('fields.date'))}</span>
        <input id="schedule-date" name="schedule-date" type="date" value="${escapeHtml(state.date)}" />
      </label>
    </div>
    <div class="zone-grid" aria-label="${escapeHtml(t('tool.zoneGridLabel'))}">
      ${activeEntries.map((entry, index) => renderZoneCard(entry, index)).join('')}
    </div>
    <div class="tool-shell__actions">
      <button class="toggle-button" type="button" data-action="toggle-third-zone">
        ${escapeHtml(state.thirdZoneEnabled ? t('tool.thirdZoneOff') : t('tool.thirdZoneOn'))}
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
      status.textContent = t('results.invalidStatus');
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

function rerenderPage() {
  setDocumentLanguage();
  renderStaticCopy();
  renderControls();
  renderResults();
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

mastheadRoot.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement) || target.id !== 'ui-language') {
    return;
  }

  state.language = getLanguage(target.value).code;
  persistLanguage();
  rerenderPage();
});

rerenderPage();
