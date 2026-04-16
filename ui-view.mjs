function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => (
    {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[character]
  ));
}

export function renderLanguageOptions({ languages, selectedLanguage }) {
  return languages
    .map((language) => {
      const selected = language.code === selectedLanguage ? ' selected' : '';
      return `<option value="${escapeHtml(language.code)}"${selected}>${escapeHtml(language.label)}</option>`;
    })
    .join('');
}

export function renderMasthead({ language, masthead, chips, languageLabel, languageOptionsHtml }) {
  return `
    <header class="masthead">
      <div class="masthead__bar">
        <p class="eyebrow">${escapeHtml(masthead.eyebrow)}</p>
        <label class="language-switcher" aria-label="${escapeHtml(languageLabel)}">
          <span>${escapeHtml(languageLabel)}</span>
          <select id="ui-language" name="ui-language" data-field="language" dir="${escapeHtml(language.dir)}">
            <!-- Trusted pre-rendered option markup. -->
            ${languageOptionsHtml}
          </select>
        </label>
      </div>
      <div class="masthead__content">
        <h1>${escapeHtml(masthead.title)}</h1>
        <p class="masthead__copy">${escapeHtml(masthead.copy)}</p>
        <ul class="feature-strip">
          ${chips.map((chip) => `<li>${escapeHtml(chip)}</li>`).join('')}
        </ul>
      </div>
    </header>
  `;
}
