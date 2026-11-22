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
  document.querySelectorAll('details').forEach(tile => observer.observe(tile));
}
