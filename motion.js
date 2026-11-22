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

const profiles = new Map([
  ['/experience', {
    data: { role: 'Software Engineer', company: 'CommerceIQ', since: 'July 2024', focus: 'Distributed ingestion' },
    target: '#career', link: 'Read employment history'
  }],
  ['/skills', {
    data: { languages: ['Java', 'TypeScript', 'Python'], services: ['Spring Boot', 'Node.js'], data: ['Airflow', 'PostgreSQL', 'Redis'] },
    target: '#skills', link: 'Browse technical skills'
  }],
  ['/projects', {
    data: { name: 'CodeShare', status: 'In development', transport: 'STOMP over WebSockets', messaging: 'Redis Pub/Sub' },
    target: '#projects', link: 'Explore CodeShare'
  }]
]);

const explorer = document.querySelector('#profile-api');
const routeInput = explorer.querySelector('input');
const shortcuts = explorer.querySelectorAll('.routes button');
const payload = explorer.querySelector('pre');
const more = explorer.querySelector('#api-more');

function showRoute(value) {
  const route = value.trim().replace(/^GET\s+/i, '').replace(/^\/?/, '/').replace(/\/$/, '').toLowerCase();
  const profile = profiles.get(route);
  routeInput.value = route || '/';
  explorer.querySelector('output').textContent = profile ? '200 OK' : '404 · Unknown route';
  payload.textContent = JSON.stringify(profile?.data ?? { available: [...profiles.keys()] }, null, 2)
    .replace(/\[\s*("[^\]]*?")\s*\]/g, (_, items) => '[' + items.replace(/,\s+/g, ', ') + ']');
  more.hidden = !profile;
  if (profile) {
    more.href = profile.target;
    more.textContent = profile.link + ' ↓';
  }
  for (const button of shortcuts) button.setAttribute('aria-pressed', String(button.textContent === route));
}
explorer.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  showRoute(routeInput.value);
});
for (const button of shortcuts) button.addEventListener('click', () => showRoute(button.textContent));
showRoute(routeInput.value);
explorer.hidden = false;

const pointerMotion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const glow = document.createElement('div');
glow.className = 'pointer-glow';
glow.setAttribute('aria-hidden', 'true');
document.body.append(glow);
let frame = 0;
let x, y;
function moveGlow(event) {
  x = event.clientX;
  y = event.clientY;
  if (frame) return;
  frame = requestAnimationFrame(() => {
    glow.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    glow.classList.add('visible');
    frame = 0;
  });
}
function hideGlow() {
  cancelAnimationFrame(frame);
  frame = 0;
  glow.classList.remove('visible');
}
function configureGlow() {
  hideGlow();
  if (pointerMotion.matches) document.addEventListener('pointermove', moveGlow, { passive: true });
  else document.removeEventListener('pointermove', moveGlow);
}
document.documentElement.addEventListener('pointerleave', hideGlow);
window.addEventListener('blur', hideGlow);
pointerMotion.addEventListener('change', configureGlow);
configureGlow();
