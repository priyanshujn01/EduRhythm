let timer;
let timeLeft = 25 * 60;
let isRunning = false;
const display = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const minutesInput = document.getElementById('minutes');
const progress = document.getElementById('progress');
const quote = document.getElementById('quote');
const appContainer = document.querySelector('.app');
const toggleLayoutBtn = document.getElementById('toggleLayout');

// Initialize layout preference from localStorage or default to floating
let isBoxed = localStorage.getItem('edurhythm.layout') === 'boxed';
updateLayout();

// Handle layout toggle
toggleLayoutBtn.addEventListener('click', () => {
    isBoxed = !isBoxed;
    updateLayout();
    // Save preference
    localStorage.setItem('edurhythm.layout', isBoxed ? 'boxed' : 'floating');
});

function updateLayout() {
    if (isBoxed) {
        appContainer.classList.remove('floating');
        appContainer.classList.add('boxed');
        toggleLayoutBtn.textContent = '🔲';
    } else {
        appContainer.classList.remove('boxed');
        appContainer.classList.add('floating');
        toggleLayoutBtn.textContent = '📦';
    }
}
// const alarm = document.getElementById('alarm');

const quotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
  "The expert in anything was once a beginner.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Education is not preparation for life; education is life itself.",
  "Learn from yesterday, live for today, hope for tomorrow.",
  "The more that you read, the more things you will know.",
  "Your future is created by what you do today, not tomorrow.",
  "The only way to do great work is to love what you do.",
  "Focus on the journey, not the destination.",
  "Every expert was once a beginner.",
  "Knowledge speaks, but wisdom listens.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Small steps every day add up to big results.",
  "Your mind is your greatest asset - keep learning.",
  "Quality over quantity - focus deeply for better results.",
  "Every minute spent studying is an investment in yourself.",
  "Stay curious, stay growing, stay learning.",
  "Success comes from consistency and persistence.",
  "The difference between try and triumph is just a little umph!",
  "Turn your dreams into plans and your plans into action.",
  "Learning is not a spectator sport - dive in!",
  "Your potential to grow is infinite."
];

function updateDisplay() {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  display.textContent = `${min.toString().padStart(2, '0')}:${sec
    .toString()
    .padStart(2, '0')}`;
  const progressLength = 565 - (timeLeft / (minutesInput.value * 60)) * 565;
  progress.style.strokeDashoffset = progressLength;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      // alarm.play(); // 🔔 Uncomment for beep
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      quote.textContent = randomQuote;
      quote.style.opacity = 1;
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = minutesInput.value * 60;
  updateDisplay();
  quote.style.opacity = 0.7;
}

// Track current quote index
let currentQuoteIndex = 0;

function showNextQuote() {
  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
  quote.style.opacity = 0;
  setTimeout(() => {
    quote.textContent = quotes[currentQuoteIndex];
    quote.style.opacity = 1;
  }, 300);
}

// Add event listener for the next quote button
document.getElementById('nextQuote').addEventListener('click', showNextQuote);

minutesInput.addEventListener('change', () => {
  timeLeft = minutesInput.value * 60;
  updateDisplay();
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();

// Background video toggle and reduced-motion handling
(function () {
  const bg = document.getElementById('bgVideo');
  const bgSource = bg ? bg.querySelector('source') : null;
  const bgLabel = document.getElementById('bgLabel');
  const prevBtn = document.getElementById('prevBg');
  const nextBtn = document.getElementById('nextBg');

  // Define available backgrounds. You can add/remove entries and update src paths.
  // type: 'video' will load the video at src. type: 'gradient' will hide the video and show CSS gradient.
  const backgrounds = [
    { id: 'nature', type: 'video', src: 'assets/nature.mp4', label: 'Nature' },
    { id: 'water', type: 'video', src: 'assets/waves.mp4', label: 'Waves' },
    { id: 'forest', type: 'video', src: 'assets/forest.mp4', label: 'Forest' },
    { id: 'clock', type: 'video', src: 'assets/clock.mp4', label: 'Illusions' },
    { id: 'sea', type: 'video', src: 'assets/sea.mp4', label: 'Sea' },
    { id: 'beach', type: 'video', src: 'assets/beach.mp4', label: 'Beach' },
    { id: 'snow', type: 'video', src: 'assets/snow.mp4', label: 'Snow' },
    { id: 'rain', type: 'video', src: 'assets/rain.mp4', label: 'Rain' },


  // Only video backgrounds, no anime/canvas or images
  ];

  // Load saved selection or default to first
  let current = 0;
  try {
    const saved = localStorage.getItem('edurhythm.bg');
    if (saved) {
      const idx = parseInt(saved, 10);
      if (!Number.isNaN(idx) && idx >= 0 && idx < backgrounds.length) current = idx;
    }
  } catch (e) {
    /* ignore localStorage errors */
  }

  function applyBackground(idx) {
    const item = backgrounds[idx];
    if (!item) return;
    current = idx;
    // Update label
    if (bgLabel) bgLabel.textContent = item.label || '';

    if (bg) {
      // Only video backgrounds: always show video
      bg.style.display = '';
      if (bgSource && bgSource.src !== item.src) {
        bgSource.src = item.src;
      }
      try {
        bg.load();
        const playPromise = bg.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => { /* autoplay blocked; user can toggle */ });
        }
      } catch (e) { /* ignore */ }
    }

    // persist selection
    try { localStorage.setItem('edurhythm.bg', String(current)); } catch (e) {}
  }

  // Event handlers for prev/next
  if (prevBtn) prevBtn.addEventListener('click', () => {
    applyBackground((current - 1 + backgrounds.length) % backgrounds.length);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    applyBackground((current + 1) % backgrounds.length);
  });

  // (initial application will be done after canvas initialization)

  // If user prefers reduced motion, ensure video does not autoplay (CSS hides it) and pause if playing
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (bg && !bg.paused) bg.pause();
  }

  // ...existing code...

  // Apply initial background now that canvas/video handlers exist
  applyBackground(current);

  // Optional: create a small toggle button to pause/play the video so user can disable it if desired
  if (bg) {
    const toggle = document.createElement('button');
    toggle.id = 'toggleBg';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.title = 'Toggle background video';
    toggle.textContent = '🎬';
    document.body.appendChild(toggle);
    toggle.addEventListener('click', () => {
      // If current background is a gradient, switching toggle should show/hide video element only
      if (bg.style.display === 'none') {
        // show last selected video-type background if exists
        // find nearest video-type background starting from current
        let found = backgrounds.findIndex((b, i) => i === current && b.type === 'video');
        if (found === -1) found = backgrounds.findIndex(b => b.type === 'video');
        if (found !== -1) applyBackground(found);
        toggle.setAttribute('aria-pressed', 'true');
        toggle.style.opacity = 1;
        return;
      }

      if (bg.paused) {
        bg.play();
        toggle.setAttribute('aria-pressed', 'true');
        toggle.style.opacity = 1;
      } else {
        bg.pause();
        toggle.setAttribute('aria-pressed', 'false');
        toggle.style.opacity = 0.7;
      }
    });
  }
})();

// -----------------------
// Draw timer onto the background canvas so it visually becomes part of the scene
// -----------------------
// Draw the timer onto a UI canvas that sits above the app so it stays sharp
(function drawTimerOnCanvas() {
  // prefer a dedicated UI canvas above the app; fall back to bgCanvas if missing
  const canvas = document.getElementById('uiCanvas') || document.getElementById('bgCanvas');
  if (!canvas) return; // nothing to do
  const appTimerWrapper = document.querySelector('.timer-circle');
  const timerTextEl = document.getElementById('timer');
  const minutesInput = document.getElementById('minutes');

  let ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = Math.max(window.innerWidth, 300);
    const h = Math.max(window.innerHeight, 200);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    if (!ctx) ctx = canvas.getContext('2d');
  // clear full canvas (using CSS pixel units)
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    // compute timer position by matching the .timer-circle element on screen
    const rect = appTimerWrapper ? appTimerWrapper.getBoundingClientRect() : { left: window.innerWidth/2 - 100, top: window.innerHeight/2 - 100, width: 200, height: 200 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = Math.min(rect.width, rect.height) * 0.45;

  // if drawing on the UI canvas (above the panel) we want the glow to sit on top
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.arc(cx, cy, radius + 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // draw base ring
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineCap = 'round';
  ctx.arc(cx, cy, radius, -Math.PI/2, Math.PI * 1.5);
  ctx.stroke();

    // progress arc (uses global timeLeft variable and minutesInput value for total)
    const totalSeconds = (minutesInput && Number(minutesInput.value)) ? Number(minutesInput.value) * 60 : 25 * 60;
    const fraction = Math.max(0, Math.min(1, (typeof timeLeft === 'number' ? timeLeft : totalSeconds) / totalSeconds));
    const progressAngle = (-Math.PI/2) + (1 - fraction) * Math.PI * 2;

  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 12;
  // accent color: read from CSS variable if possible
  let accent = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#00bfa6';
  accent = accent.trim() || '#00bfa6';
  // add glow to the progress arc so it reads against varied video content
  ctx.shadowBlur = 18;
  ctx.shadowColor = accent;
  ctx.strokeStyle = accent;
  ctx.lineCap = 'round';
  ctx.arc(cx, cy, radius, -Math.PI/2, progressAngle, false);
  ctx.stroke();
  ctx.restore();

    // draw time text centered
    const displayText = (timerTextEl && timerTextEl.textContent) ? timerTextEl.textContent : '00:00';
  ctx.font = '700 34px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // text shadow using multiple draws for softness
  // draw subtle stroke for legibility
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(0,0,0,0.6)';
  ctx.strokeText(displayText, cx, cy);
  ctx.fillStyle = '#fff';
  ctx.fillText(displayText, cx, cy);

    requestAnimationFrame(draw);
  }

  // initialize
  resize();
  // keep canvas size correct on resize / DPR changes
  window.addEventListener('resize', resize);
  // start rendering loop
  requestAnimationFrame(draw);
})();
