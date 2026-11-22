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
    data: { experience: [
      { company: 'CommerceIQ', role: 'Software Engineer', summary: 'I build ingestion services that handle over four million requests a day.' },
      { company: 'Tech Mahindra', role: 'Software Engineer Intern', summary: 'I built forecasting tools that accounted for local billing rates and calendars.' },
      { company: 'YANA', role: 'Software Engineer Intern', summary: 'I helped travelers get personalized itineraries faster and built streaming exports.' }
    ] },
    target: '#career', link: 'See where I’ve worked'
  }],
  ['/skills', {
    data: { skills: [
      { name: 'Java & Spring', summary: 'I used Spring MVC to build services for staffing and budget forecasts.' },
      { name: 'Node.js & Express', summary: 'I built a generator that turns API schemas into deployable service modules.' },
      { name: 'Apache Airflow', summary: 'I use DAGs to validate incoming data, remove duplicates, and schedule work.' },
      { name: 'Kubernetes', summary: 'I profile CPU and memory usage to keep crawlers running during peak loads.' },
      { name: 'Redis Pub/Sub', summary: 'I’m using it in the CodeShare design to carry edits between servers.' }
    ] },
    target: '#skills', link: 'Browse technical skills'
  }],
  ['/projects', {
    data: { projects: [
      { name: 'CodeShare', status: 'In development', summary: 'I’m building a shared code editor that keeps edits in sync across servers.' }
    ] },
    target: '#projects', link: 'Explore CodeShare'
  }]
]);

const explorer = document.querySelector('#profile-api');
const routeInput = explorer.querySelector('input');
const shortcuts = explorer.querySelectorAll('.routes button');
const payload = explorer.querySelector('pre');
const more = explorer.querySelector('#api-more');

const response = explorer.querySelector('.api-response');
const hint = explorer.querySelector('#api-hint');
const statusOutput = explorer.querySelector('output');
const sendButton = explorer.querySelector('[type="submit"]');

function selectedRoute() {
  const path = routeInput.value.trim().replace(/^GET\s+/i, '').toLowerCase();
  return '/' + path.replace(/^\/+|\/+$/g, '');
}

function prepareRequest() {
  response.hidden = true;
  sendButton.setAttribute('aria-expanded', 'false');
  sendButton.textContent = 'Send ↵';
  hint.hidden = false;
  more.hidden = true;
  statusOutput.textContent = '';
  payload.replaceChildren();
  const route = selectedRoute();
  for (const button of shortcuts) {
    button.setAttribute('aria-pressed', String(button.textContent === route));
  }
}

function formatResponse(data) {
  const json = JSON.stringify(data, null, 2);
  const fragment = document.createDocumentFragment();
  let offset = 0;
  // Keep JSON.stringify's punctuation and indentation verbatim.
  for (const match of json.matchAll(/"(?:\\.|[^"\\])*"/g)) {
    fragment.append(json.slice(offset, match.index));
    offset = match.index + match[0].length;
    const token = document.createElement('span');
    token.className = json[offset] === ':' ? 'json-key' : 'json-value';
    token.textContent = match[0];
    fragment.append(token);
  }
  fragment.append(json.slice(offset));
  payload.replaceChildren(fragment);
  payload.scrollTop = 0;
}

explorer.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  if (!response.hidden) {
    prepareRequest();
    return;
  }
  sendButton.setAttribute('aria-expanded', 'true');
  sendButton.textContent = 'Hide ↑';
  const route = selectedRoute();
  const profile = profiles.get(route);
  routeInput.value = route;
  hint.hidden = true;
  response.hidden = false;
  statusOutput.textContent = profile ? '200 OK' : '404 Not Found';
  formatResponse(profile?.data ?? {
    message: 'Try one of these routes to explore my profile.',
    routes: [...profiles.keys()]
  });
  more.hidden = !profile;
  if (profile) {
    more.href = profile.target;
    more.textContent = profile.link + ' ↓';
  }
});

routeInput.addEventListener('input', prepareRequest);
for (const button of shortcuts) {
  button.addEventListener('click', () => {
    routeInput.value = button.textContent;
    prepareRequest();
  });
}
prepareRequest();
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
