/* =============================================
   ALEX CHEN — PORTFOLIO
   main.js
   ============================================= */

// ========== CUSTOM CURSOR ==========
const cursor = document.getElementById('cursor');
const dot    = document.getElementById('cursor-dot');
const ring   = document.getElementById('cursor-ring');
let cx = 0, cy = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  dot.style.left = cx + 'px';
  dot.style.top  = cy + 'px';
});

function animRing() {
  rx += (cx - rx) * 0.15;
  ry += (cy - ry) * 0.15;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll(
  'a, button, .project-card, .skill-cat, .social-link, .repo-card, .fact-chip, .stat-chip, .filter-btn, .viz-btn'
).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});


// ========== CANVAS PARTICLE BACKGROUND ==========
const canvas = document.getElementById('canvas-bg');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.vx   = (Math.random() - 0.5) * 0.3;
    this.vy   = (Math.random() - 0.5) * 0.3;
    this.r    = Math.random() * 1.5 + 0.5;
    this.life = Math.random();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = isDark
      ? `rgba(232,164,53,${0.08 + this.life * 0.15})`
      : `rgba(196,127,16,${0.05 + this.life * 0.1})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = isDark
          ? `rgba(232,164,53,${0.04 * (1 - d / 100)})`
          : `rgba(196,127,16,${0.03 * (1 - d / 100)})`;
        ctx.stroke();
      }
    }
  }
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(drawCanvas);
}
drawCanvas();


// ========== TYPED TEXT ANIMATION ==========
const phrases  = ['Python & ML', 'React & Node.js', 'neural networks', 'clean algorithms', 'open source'];
let pi = 0, ci = 0, deleting = false;
const typedEl  = document.getElementById('typed');

function typeLoop() {
  if (!deleting) {
    typedEl.textContent = phrases[pi].slice(0, ci + 1);
    ci++;
    if (ci === phrases[pi].length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = phrases[pi].slice(0, ci - 1);
    ci--;
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 90);
}
typeLoop();


// ========== SCROLL HANDLERS ==========
window.addEventListener('scroll', () => {
  // Nav glass effect
  document.getElementById('main-nav').classList.toggle('scrolled', window.scrollY > 40);
  // Progress bar
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('scroll-progress').style.width = pct + '%';
});


// ========== INTERSECTION OBSERVER — fade-ups & skill bars ==========
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .skill-cat').forEach(el => fadeObs.observe(el));


// ========== ACTIVE NAV SECTION HIGHLIGHT ==========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.style.color = '');
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (link) link.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => secObs.observe(s));


// ========== DARK / LIGHT THEME TOGGLE ==========
function toggleTheme() {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  // Update first theme button (there are two .btn-theme buttons)
  document.querySelector('.btn-theme').textContent = isDark ? '🌙' : '☀️';
}


// ========== PROJECT FILTER ==========
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const cat = card.dataset.category || '';
      card.classList.toggle('hidden', filter !== 'all' && !cat.includes(filter));
    });
  });
});


// ========== SORTING ALGORITHM VISUALIZER ==========
let vizData = [], vizAlgo = 'bubble', vizRunning = false;
let comparisons = 0, swaps = 0, vizStartTime = 0;

function initViz() {
  const stage = document.getElementById('viz-stage');
  const n     = Math.floor(stage.offsetWidth / 14);
  vizData     = Array.from({ length: Math.min(n, 60) }, () => Math.floor(Math.random() * 180) + 20);
  renderBars();
  document.getElementById('viz-comps').textContent = '0';
  document.getElementById('viz-swaps').textContent = '0';
  document.getElementById('viz-time').textContent  = '0ms';
  comparisons = 0; swaps = 0;
}

function renderBars(states = {}) {
  const stage  = document.getElementById('viz-stage');
  stage.innerHTML = '';
  const maxH   = stage.offsetHeight - 10;
  const maxVal = Math.max(...vizData);
  vizData.forEach((v, i) => {
    const bar = document.createElement('div');
    bar.className = 'viz-bar' + (states[i] ? ' ' + states[i] : '');
    bar.style.height = (v / maxVal * maxH) + 'px';
    stage.appendChild(bar);
  });
}

function setAlgo(algo, btn) {
  vizAlgo = algo;
  document.querySelectorAll('.viz-btn[data-algo]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('viz-algo').textContent = btn.textContent;
  resetViz();
}

function resetViz() {
  vizRunning = false;
  initViz();
}

async function runSort() {
  if (vizRunning) return;
  vizRunning   = true;
  comparisons  = 0; swaps = 0;
  vizStartTime = Date.now();
  const delay  = ms => new Promise(r => setTimeout(r, ms));

  if (vizAlgo === 'bubble') {
    for (let i = 0; i < vizData.length && vizRunning; i++) {
      for (let j = 0; j < vizData.length - i - 1 && vizRunning; j++) {
        comparisons++;
        document.getElementById('viz-comps').textContent = comparisons;
        renderBars({ [j]: 'comparing', [j + 1]: 'comparing' });
        await delay(12);
        if (vizData[j] > vizData[j + 1]) {
          [vizData[j], vizData[j + 1]] = [vizData[j + 1], vizData[j]];
          swaps++;
          document.getElementById('viz-swaps').textContent = swaps;
          renderBars({ [j]: 'swapping', [j + 1]: 'swapping' });
          await delay(12);
        }
      }
      const sorted = {};
      for (let k = vizData.length - i - 1; k < vizData.length; k++) sorted[k] = 'sorted';
      renderBars(sorted);
    }

  } else if (vizAlgo === 'selection') {
    for (let i = 0; i < vizData.length && vizRunning; i++) {
      let minIdx = i;
      for (let j = i + 1; j < vizData.length && vizRunning; j++) {
        comparisons++;
        document.getElementById('viz-comps').textContent = comparisons;
        renderBars({ [j]: 'comparing', [minIdx]: 'comparing' });
        await delay(15);
        if (vizData[j] < vizData[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [vizData[i], vizData[minIdx]] = [vizData[minIdx], vizData[i]];
        swaps++;
        document.getElementById('viz-swaps').textContent = swaps;
        renderBars({ [i]: 'swapping', [minIdx]: 'swapping' });
        await delay(15);
      }
    }
    renderBars(Object.fromEntries(vizData.map((_, i) => [i, 'sorted'])));

  } else if (vizAlgo === 'insertion') {
    for (let i = 1; i < vizData.length && vizRunning; i++) {
      let key = vizData[i], j = i - 1;
      while (j >= 0 && vizRunning && vizData[j] > key) {
        comparisons++;
        document.getElementById('viz-comps').textContent = comparisons;
        vizData[j + 1] = vizData[j];
        swaps++;
        document.getElementById('viz-swaps').textContent = swaps;
        renderBars({ [j + 1]: 'swapping', [j]: 'comparing' });
        await delay(18);
        j--;
      }
      vizData[j + 1] = key;
      renderBars({ [j + 1]: 'comparing' });
      await delay(10);
    }
    renderBars(Object.fromEntries(vizData.map((_, i) => [i, 'sorted'])));

  } else if (vizAlgo === 'merge') {
    async function mergeSort(arr, l, r) {
      if (!vizRunning || l >= r) return;
      const m = Math.floor((l + r) / 2);
      await mergeSort(arr, l, m);
      await mergeSort(arr, m + 1, r);
      await merge(arr, l, m, r);
    }
    async function merge(arr, l, m, r) {
      const left = arr.slice(l, m + 1), right = arr.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;
      while (i < left.length && j < right.length && vizRunning) {
        comparisons++;
        document.getElementById('viz-comps').textContent = comparisons;
        renderBars({ [k]: 'comparing' });
        await delay(20);
        if (left[i] <= right[j]) { arr[k++] = left[i++]; }
        else {
          arr[k++] = right[j++];
          swaps++;
          document.getElementById('viz-swaps').textContent = swaps;
        }
      }
      while (i < left.length) arr[k++] = left[i++];
      while (j < right.length) arr[k++] = right[j++];
      renderBars({});
    }
    await mergeSort(vizData, 0, vizData.length - 1);
    renderBars(Object.fromEntries(vizData.map((_, i) => [i, 'sorted'])));
  }

  document.getElementById('viz-time').textContent = (Date.now() - vizStartTime) + 'ms';
  vizRunning = false;
}

initViz();
window.addEventListener('resize', initViz);


// ========== GITHUB CONTRIBUTION GRAPH ==========
function buildContribGraph() {
  const graph = document.getElementById('contrib-graph');
  for (let w = 0; w < 52; w++) {
    const week = document.createElement('div');
    week.className = 'contrib-week';
    for (let d = 0; d < 7; d++) {
      const day  = document.createElement('div');
      const rand = Math.random();
      // Slightly more activity toward recent weeks (higher w)
      const bias = w / 52;
      if      (rand < 0.22 - bias * 0.05) day.className = 'contrib-day';
      else if (rand < 0.42)               day.className = 'contrib-day l1';
      else if (rand < 0.62)               day.className = 'contrib-day l2';
      else if (rand < 0.80)               day.className = 'contrib-day l3';
      else                                day.className = 'contrib-day l4';
      // Occasional days off
      if (Math.random() < 0.1) day.className = 'contrib-day';
      week.appendChild(day);
    }
    graph.appendChild(week);
  }
}
buildContribGraph();


// ========== COMMAND PALETTE ==========
const commands = [
  { icon: '👤', name: 'About Me',        desc: '#about',       action: () => scrollTo('#about') },
  { icon: '💼', name: 'View Projects',   desc: '#projects',    action: () => scrollTo('#projects') },
  { icon: '🛠️', name: 'Skills',          desc: '#skills',      action: () => scrollTo('#skills') },
  { icon: '📊', name: 'Algo Visualizer', desc: '#visualizer',  action: () => scrollTo('#visualizer') },
  { icon: '🎓', name: 'Education',       desc: '#education',   action: () => scrollTo('#education') },
  { icon: '📬', name: 'Contact Me',      desc: '#contact',     action: () => scrollTo('#contact') },
  { icon: '📄', name: 'Download Resume', desc: 'PDF',          action: downloadResume },
  { icon: '⚡', name: 'Recruiter Mode',  desc: 'Quick overview', action: openRecruiter },
  { icon: '🌙', name: 'Toggle Theme',    desc: 'Dark / Light', action: toggleTheme },
  { icon: '🐙', name: 'GitHub Profile',  desc: 'github.com/alexchen',        action: () => showToast('Opening GitHub...') },
  { icon: '💼', name: 'LinkedIn',        desc: 'linkedin.com/in/alexchen',   action: () => showToast('Opening LinkedIn...') },
];

function scrollTo(selector) {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

let cmdActive = 0;

function openCmd() {
  document.getElementById('cmd-palette').classList.add('open');
  const input = document.getElementById('cmd-input');
  input.value = '';
  renderCmdResults('');
  setTimeout(() => input.focus(), 50);
  cmdActive = 0;
}

function closeCmd() {
  document.getElementById('cmd-palette').classList.remove('open');
}

function renderCmdResults(q) {
  const res      = document.getElementById('cmd-results');
  const filtered = commands.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.desc.toLowerCase().includes(q.toLowerCase())
  );
  res.innerHTML = filtered.map((c, i) =>
    `<div class="cmd-item${i === 0 ? ' active' : ''}" data-idx="${commands.indexOf(c)}" onclick="runCmd(${commands.indexOf(c)})">` +
    `<span class="c-icon">${c.icon}</span>` +
    `<span class="c-name">${c.name}</span>` +
    `<span class="c-desc">${c.desc}</span></div>`
  ).join('');
  cmdActive = 0;
}

document.getElementById('cmd-input').addEventListener('input', e => renderCmdResults(e.target.value));

document.getElementById('cmd-input').addEventListener('keydown', e => {
  const items = document.querySelectorAll('.cmd-item');
  if (e.key === 'ArrowDown') {
    cmdActive = Math.min(cmdActive + 1, items.length - 1);
    items.forEach((el, i) => el.classList.toggle('active', i === cmdActive));
    e.preventDefault();
  }
  if (e.key === 'ArrowUp') {
    cmdActive = Math.max(cmdActive - 1, 0);
    items.forEach((el, i) => el.classList.toggle('active', i === cmdActive));
    e.preventDefault();
  }
  if (e.key === 'Enter') {
    const active = document.querySelector('.cmd-item.active');
    if (active) runCmd(parseInt(active.dataset.idx));
  }
  if (e.key === 'Escape') closeCmd();
});

document.getElementById('cmd-palette').addEventListener('click', e => {
  if (e.target === document.getElementById('cmd-palette')) closeCmd();
});

function runCmd(idx) {
  commands[idx].action();
  closeCmd();
}

// Global keyboard shortcut: Cmd/Ctrl + K
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openCmd(); }
  if (e.key === 'Escape') closeCmd();
});


// ========== RECRUITER MODAL ==========
function openRecruiter()  { document.getElementById('recruiter-modal').classList.add('open'); }
function closeRecruiter() { document.getElementById('recruiter-modal').classList.remove('open'); }

document.getElementById('recruiter-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('recruiter-modal')) closeRecruiter();
});


// ========== TOAST NOTIFICATION ==========
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg || '📋 Copied!';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}


// ========== UTILITY ACTIONS ==========
function copyEmail(e) {
  e.preventDefault();
  navigator.clipboard.writeText('alex.chen@mcmaster.ca')
    .then(() => showToast('📋 Email copied!'));
}

function downloadResume() {
  showToast('📄 Resume download starting...');
  // Replace with: window.open('resume.pdf', '_blank');
}

function submitForm(e) {
  e.preventDefault();
  showToast("✅ Message sent! I'll reply within 24h.");
}

function easterEgg() {
  const msgs = [
    '🎉 You found the secret! +10 respect points.',
    '🦆 There\'s a rubber duck in my desk drawer. It\'s my debugging partner.',
    '🤫 I once fixed a bug by staring at it for 3 hours. It fixed itself.',
    '☕ This site runs on caffeine and late nights.',
    '🚀 Fun fact: this entire site was built in one coding session.'
  ];
  showToast(msgs[Math.floor(Math.random() * msgs.length)]);
}
