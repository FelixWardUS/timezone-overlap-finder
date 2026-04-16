const dateInput = document.querySelector("#schedule-date");
const resultsPanel = document.querySelector("#results-panel");

if (!dateInput) {
  throw new Error("Missing required date input: #schedule-date");
}

if (!resultsPanel) {
  throw new Error("Missing required results panel: #results-panel");
}

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10);

dateInput.value = localDate;
resultsPanel.setAttribute("aria-live", "polite");
resultsPanel.classList.add("is-loading");

resultsPanel.innerHTML = `
  <div>
    <p class="eyebrow">Loading</p>
    <p>
      The interactive overlap tool will appear here once the wiring is added in
      the next task.
    </p>
  </div>
`;
