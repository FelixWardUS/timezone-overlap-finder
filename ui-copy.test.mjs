import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getLanguage,
  STRINGS,
  translate,
} from './ui-copy.mjs';

function collectLeafPaths(node, prefix = '') {
  return Object.entries(node).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return collectLeafPaths(value, path);
    }

    return [path];
  });
}

const stylesheet = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');

test('supported languages stay in the approved order', () => {
  assert.deepEqual(
    SUPPORTED_LANGUAGES.map((language) => language.code),
    ['en', 'zh-CN', 'hi', 'es', 'ar', 'fr', 'pt', 'ja'],
  );
});

test('getLanguage falls back to English for unknown language codes', () => {
  assert.equal(DEFAULT_LANGUAGE, 'en');
  assert.equal(getLanguage('xx').code, 'en');
});

test('Arabic is marked as an RTL language', () => {
  assert.equal(getLanguage('ar').dir, 'rtl');
  assert.equal(getLanguage('fr').dir, 'ltr');
});

test('translate interpolates summary variables', () => {
  const value = translate('en', 'summary.ready', {
    duration: '3h',
    count: '2',
    date: '2026-04-16',
  });

  assert.equal(value, '3h shared across 2 time zones on 2026-04-16');
});

test('translate returns Chinese UI copy for known keys', () => {
  assert.equal(translate('zh-CN', 'toolbar.addThirdZone'), '添加第三个时区');
  assert.notEqual(translate('zh-CN', 'toolbar.addThirdZone'), translate('en', 'toolbar.addThirdZone'));
});

test('translate exposes the page-shell copy needed by app rendering', () => {
  assert.equal(translate('en', 'tool.eyebrow'), 'Overlap planner');
  assert.equal(translate('en', 'tool.controlsLabel'), 'Schedule controls');
  assert.equal(translate('en', 'tool.zoneGridLabel'), 'Time zone cards');
  assert.equal(translate('en', 'fields.zoneNumber', { number: '3' }), 'Time zone 3');
  assert.equal(translate('en', 'results.scale.noon'), '12 PM');
  assert.equal(
    translate('en', 'summary.duration.hoursMinutes', { hours: '2', minutes: '30' }),
    '2h 30m',
  );
  assert.equal(translate('en', 'results.readyEyebrow'), 'Shared hours');
  assert.equal(translate('en', 'results.emptyTitle'), 'Complete the schedule');
  assert.equal(
    translate('en', 'results.emptyBody'),
    'Add a time zone and both working-hour endpoints for every active card.',
  );
});

test('supported locales throw when a translation key is missing', () => {
  assert.equal(translate('en', 'tool.language'), 'Language');
  assert.throws(() => translate('zh-CN', 'tool.notARealKey'), /Missing translation/);
});

test('supported locales keep the English dictionary shape', () => {
  const englishLeafPaths = collectLeafPaths(STRINGS.en);

  for (const language of SUPPORTED_LANGUAGES) {
    const locale = STRINGS[language.code];

    for (const path of englishLeafPaths) {
      const value = path.split('.').reduce((current, part) => current?.[part], locale);
      assert.equal(typeof value, 'string', `${language.code} missing ${path}`);
    }
  }
});

test('stylesheet includes compact masthead and RTL-safe day-view rules', () => {
  assert.match(stylesheet, /\.masthead\s*\{/);
  assert.match(stylesheet, /\.masthead__bar\s*\{/);
  assert.match(stylesheet, /\.language-switcher\s*\{/);
  assert.match(stylesheet, /html\[dir="rtl"\]\s+\.result-summary/);
  assert.match(stylesheet, /html\[dir="rtl"\]\s+\.result-row/);
  assert.match(stylesheet, /\.time-bar,\s*\n\.time-bar__scale\s*\{[\s\S]*direction:\s*ltr;/);
});
