import test from 'node:test';
import assert from 'node:assert/strict';
import { renderLanguageOptions, renderMasthead } from './ui-view.mjs';
import { getLanguage } from './ui-copy.mjs';

test('renderLanguageOptions marks the active language as selected', () => {
  const html = renderLanguageOptions({
    languages: [
      { code: 'en', label: 'English' },
      { code: 'ar', label: 'العربية' },
    ],
    selectedLanguage: 'ar',
  });

  assert.match(html, /value="ar" selected/);
  assert.match(html, />English</);
});

test('renderMasthead uses the compact masthead layout hooks', () => {
  const html = renderMasthead({
    language: getLanguage('en'),
    strings: {
      eyebrow: 'Productivity tool',
      title: 'Timezone Overlap Finder',
      copy: 'Compact product intro.',
      chips: ['2-3 time zones', 'Overnight schedules', 'Local-time overlap view'],
      languageLabel: 'Language',
    },
    languageOptionsHtml: '<option value="en" selected>English</option>',
  });

  assert.match(html, /class="masthead"/);
  assert.match(html, /class="masthead__bar"/);
  assert.match(html, /aria-label="Language"/);
  assert.doesNotMatch(html, /class="hero"/);
});
