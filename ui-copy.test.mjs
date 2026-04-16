import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getLanguage,
  translate,
} from './ui-copy.mjs';

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
