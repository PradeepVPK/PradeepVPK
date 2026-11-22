const themeButton = document.querySelector('#theme');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark';
  themeButton.textContent = dark ? '☀' : '☾';
  themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  document.querySelector('[name="theme-color"]').content = dark ? '#10111b' : '#eeedf8';
}
applyTheme(document.documentElement.dataset.theme);
themeButton.hidden = false;
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem('pv-theme', theme); } catch {}
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting && entry.target.open) entry.target.open = false;
    }
  });
  document.querySelectorAll('.tile').forEach(tile => observer.observe(tile));
}

const lab = document.querySelector('#lab');
const output = lab.querySelector('#events');
const statusLine = lab.querySelector('#result');
const reset = lab.querySelector('#reset');
const commands = [...lab.querySelectorAll('[data-stage]')];
const stages = ['validate', 'deduplicate', 'schedule'];
let events;
let step;
function restart() {
  events = ['A17', null, 'A17', 'B04'];
  step = 0;
  output.textContent = '[A17, null, A17, B04]';
  statusLine.textContent = 'Choose the first stage.';
  commands.forEach(button => { button.disabled = false; });
  reset.hidden = true;
}
for (const button of commands) {
  button.addEventListener('click', () => {
    if (button.dataset.stage !== stages[step]) {
      statusLine.textContent = step === 0 ? 'Check for missing IDs first.' : 'A17 still appears twice. Remove the duplicate before scheduling.';
      return;
    }
    if (step === 0) events = events.filter(id => id !== null);
    if (step === 1) events = [...new Set(events)];
    output.textContent = '[' + events.join(', ') + ']';
    statusLine.textContent = ['Validation passed. Three events have IDs.', 'Two unique events remain. Where should they go next?', 'Batch complete. A17 and B04 were each scheduled once.'][step];
    button.disabled = true;
    step++;
    if (step === stages.length) {
      reset.hidden = false;
      reset.focus();
    }
  });
}
reset.addEventListener('click', () => { restart(); commands[0].focus(); });
restart();
lab.hidden = false;
