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
  assert.match(html, />العربية</);
});

test('renderMasthead uses the compact masthead layout hooks', () => {
  const html = renderMasthead({
    language: getLanguage('en'),
    masthead: {
      eyebrow: 'Productivity tool',
      title: 'Timezone Overlap Finder',
      copy: 'Compact product intro.',
    },
    chips: ['2-3 time zones', 'Overnight schedules', 'Local-time overlap view'],
    languageLabel: 'Language',
    languageOptionsHtml: '<option value="en" selected>English</option>',
  });

  assert.match(html, /class="masthead"/);
  assert.match(html, /class="masthead__bar"/);
  assert.match(html, /aria-label="Language"/);
  assert.match(html, /id="ui-language"/);
  assert.match(html, /name="ui-language"/);
  assert.match(html, /data-field="language"/);
  assert.match(html, /<li>2-3 time zones<\/li>/);
  assert.match(html, /<li>Overnight schedules<\/li>/);
  assert.match(html, /<li>Local-time overlap view<\/li>/);
  assert.doesNotMatch(html, /class="hero"/);
});

test('renderMasthead escapes content and propagates rtl direction', () => {
  const html = renderMasthead({
    language: getLanguage('ar'),
    masthead: {
      eyebrow: 'Tool & more',
      title: 'Timezone <Overlap> Finder',
      copy: 'Use "quotes" & apostrophes',
    },
    chips: ['<span>unsafe</span>'],
    languageLabel: 'اللغة',
    languageOptionsHtml: '<option value="ar" selected>العربية</option>',
  });

  assert.match(html, /dir="rtl"/);
  assert.match(html, /Tool &amp; more/);
  assert.match(html, /Timezone &lt;Overlap&gt; Finder/);
  assert.match(html, /Use &quot;quotes&quot; &amp; apostrophes/);
  assert.match(html, /&lt;span&gt;unsafe&lt;\/span&gt;/);
});
