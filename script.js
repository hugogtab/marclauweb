/* ============================================
   LA MEJOR PÁGINA WEB DEL MUNDO - V2
   All features, games, and interactions
   ============================================ */

// ============ LOADING SCREEN ============
window.addEventListener('load', () => {
    const bar = document.getElementById('loader-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30 + 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('loaded');
            }, 400);
        }
        bar.style.width = `${progress}%`;
    }, 300);
});

// ============ AUDIO CONTEXT ============
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone(frequency, duration = 0.3, type = 'sine', volume = 0.3) {
    try {
        const ctx = getAudioCtx();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (e) { /* silent fail */ }
}

// ============ LOCALSTORAGE HELPERS ============
function saveRecord(key, value) {
    try { localStorage.setItem(`mcla_${key}`, JSON.stringify(value)); } catch(e) {}
}

function getRecord(key, fallback = 0) {
    try {
        const v = localStorage.getItem(`mcla_${key}`);
        return v !== null ? JSON.parse(v) : fallback;
    } catch(e) { return fallback; }
}

// Load saved records on startup
function loadSavedRecords() {
    const simonRec = getRecord('simon_record');
    if (simonRec) document.getElementById('simon-record').textContent = simonRec;

    const quizRec = getRecord('quiz_record');
    if (quizRec) document.getElementById('quiz-record-display').textContent = quizRec;

    const rhythmRec = getRecord('rhythm_record');
    if (rhythmRec) document.getElementById('rhythm-record').textContent = rhythmRec;

    const dbBest = getRecord('db_best', null);
    if (dbBest) document.getElementById('db-best').textContent = dbBest;

    const penaltyRec = getRecord('penalty_record');
    if (penaltyRec) document.getElementById('penalty-record').textContent = penaltyRec;

    const dbCharRec = getRecord('db_char_record');
    if (dbCharRec) document.getElementById('db-char-record').textContent = dbCharRec;

    const bubbleRec = getRecord('bubble_count');
    if (bubbleRec) {
        bubbleCount = bubbleRec;
        document.getElementById('bubble-count').textContent = bubbleRec;
    }
}

// ============ NAVIGATION & SCROLL ============
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === id);
            });
        }
    });
}, { root: null, rootMargin: '0px', threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));

// Smooth scroll
document.querySelectorAll('.nav-link, .kid-card, .back-home').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(el.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ============ SWIPE GESTURES (mobile) ============
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) < 80) return;

    const sectionIds = ['home', 'marcos', 'claudia', 'alvaro', 'secret'];
    let currentIdx = 0;

    // Find which section is most visible
    sections.forEach((s, i) => {
        const rect = s.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentIdx = i;
        }
    });

    if (diff > 0 && currentIdx < sectionIds.length - 1) {
        // Swipe up - next section
        document.getElementById(sectionIds[currentIdx + 1]).scrollIntoView({ behavior: 'smooth' });
    } else if (diff < 0 && currentIdx > 0) {
        // Swipe down - previous section
        document.getElementById(sectionIds[currentIdx - 1]).scrollIntoView({ behavior: 'smooth' });
    }
}

// ============ FLOATING ELEMENTS ============
const floatingConfig = {
    'home-floats': ['✨', '⭐', '🌟', '💫', '🎉', '🎊', '❤️', '🌈'],
    'marcos-floats': ['⚽', '🐉', '⭐', '🏆', '💪', '🔥', '⚡', '🥇'],
    'claudia-floats': ['🎵', '🎶', '💃', '🌸', '✨', '💖', '⚔️', '🎤'],
    'alvaro-floats': ['⭐', '🌙', '☁️', '🧸', '🌈', '🎈', '🍼', '💝'],
    'secret-floats': ['💌', '❤️', '💕', '✨', '🌟', '💖', '🥰', '💗']
};

function createFloatingElements() {
    Object.entries(floatingConfig).forEach(([id, emojis]) => {
        const container = document.getElementById(id);
        if (!container) return;
        for (let i = 0; i < 15; i++) {
            const item = document.createElement('span');
            item.className = 'floating-item';
            item.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            item.style.left = `${Math.random() * 100}%`;
            item.style.top = `${Math.random() * 100}%`;
            item.style.animationDelay = `${Math.random() * 8}s`;
            item.style.animationDuration = `${6 + Math.random() * 6}s`;
            item.style.fontSize = `${1 + Math.random() * 2}rem`;
            item.style.opacity = `${0.15 + Math.random() * 0.35}`;
            container.appendChild(item);
        }
    });
}
createFloatingElements();

// ============ STARFIELD (Home) ============
function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        stars = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.005
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            star.opacity += star.twinkleSpeed;
            if (star.opacity > 1 || star.opacity < 0.1) star.twinkleSpeed *= -1;
            star.y += star.speed;
            if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
}
initStarfield();

// ============ SPARKLE ON CLICK ============
document.addEventListener('click', (e) => {
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.left = `${e.clientX + (Math.random() - 0.5) * 40}px`;
        sparkle.style.top = `${e.clientY + (Math.random() - 0.5) * 40}px`;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
    }
});

// ============ CONFETTI ============
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

function launchConfetti() {
    confettiPieces = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA', '#FF69B4', '#FFD700', '#60A5FA'];
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: -20 - Math.random() * 200,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: (Math.random() - 0.5) * 4,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10
        });
    }
    confettiActive = true;
    animateConfetti();
}

function animateConfetti() {
    if (!confettiActive) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let stillActive = false;

    confettiPieces.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        p.speedY += 0.05;

        if (p.y < confettiCanvas.height + 50) {
            stillActive = true;
            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate((p.rotation * Math.PI) / 180);
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            confettiCtx.restore();
        }
    });

    if (stillActive) {
        requestAnimationFrame(animateConfetti);
    } else {
        confettiActive = false;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

// ============ DARK MODE TOGGLE ============
let darkMode = getRecord('dark_mode', false);

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    document.getElementById('dark-mode-toggle').textContent = darkMode ? '☀️' : '🟠';
    saveRecord('dark_mode', darkMode);
}

if (darkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('dark-mode-toggle').textContent = '☀️';
}

// ============ DISCO BALL RAYS (Claudia) ============
function createDiscoRays() {
    const container = document.getElementById('disco-rays');
    if (!container) return;
    const colors = ['#FF69B4', '#E040FB', '#FFD700', '#4FC3F7', '#FF6B6B', '#A78BFA'];
    for (let i = 0; i < 12; i++) {
        const ray = document.createElement('div');
        ray.className = 'disco-ray';
        const angle = (360 / 12) * i;
        ray.style.transform = `rotate(${angle}deg)`;
        ray.style.background = `linear-gradient(180deg, ${colors[i % colors.length]}, transparent)`;
        ray.style.animationDelay = `${(i * 0.15)}s`;
        container.appendChild(ray);
    }
}
createDiscoRays();

// ============ DANCE FLOOR TILES ============
function createDanceTiles() {
    const container = document.getElementById('dance-tiles');
    if (!container) return;
    for (let i = 0; i < 12; i++) {
        const tile = document.createElement('div');
        tile.className = 'dance-tile';
        container.appendChild(tile);
    }
    setInterval(() => {
        const tiles = container.querySelectorAll('.dance-tile');
        const t = tiles[Math.floor(Math.random() * tiles.length)];
        const colors = ['rgba(255,105,180,0.4)', 'rgba(200,100,255,0.4)', 'rgba(255,215,0,0.4)', 'rgba(0,200,255,0.4)'];
        t.style.background = colors[Math.floor(Math.random() * colors.length)];
        t.classList.add('lit');
        setTimeout(() => { t.style.background = 'rgba(255,255,255,0.05)'; t.classList.remove('lit'); }, 500);
    }, 400);
}
createDanceTiles();

// ============ CLOUDS (Alvaro) ============
function createClouds() {
    const container = document.getElementById('clouds-container');
    if (!container) return;
    for (let i = 0; i < 6; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.textContent = '☁️';
        cloud.style.top = `${10 + Math.random() * 40}%`;
        cloud.style.animationDuration = `${20 + Math.random() * 30}s`;
        cloud.style.animationDelay = `${-Math.random() * 30}s`;
        cloud.style.fontSize = `${3 + Math.random() * 3}rem`;
        cloud.style.opacity = `${0.3 + Math.random() * 0.4}`;
        container.appendChild(cloud);
    }
}
createClouds();

// Day/Night Toggle
let isNight = false;

function toggleDayNight() {
    isNight = !isNight;
    const section = document.getElementById('alvaro');
    const btn = document.getElementById('day-night-btn');
    const clouds = document.getElementById('clouds-container');

    section.classList.toggle('night-mode', isNight);
    btn.textContent = isNight ? '☀️' : '🌙';

    // Add/remove stars
    clouds.querySelectorAll('.night-star').forEach(s => s.remove());
    if (isNight) {
        for (let i = 0; i < 40; i++) {
            const star = document.createElement('div');
            star.className = 'night-star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 60}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            star.style.width = `${2 + Math.random() * 3}px`;
            star.style.height = star.style.width;
            clouds.appendChild(star);
        }
    }
}

// ============================================
// MARCOS: POWER LEVEL (with Saiyan Aura)
// ============================================
let powerLevel = 0;
const powerRanks = [
    { min: 0, label: 'Humano normal', color: '#aaa' },
    { min: 10, label: '¡Estudiante de artes marciales!', color: '#FFD700' },
    { min: 25, label: '¡Nivel Krilin!', color: '#FFA000' },
    { min: 40, label: '¡Nivel Piccolo!', color: '#4CAF50' },
    { min: 55, label: '¡¡Nivel Vegeta!!', color: '#2196F3' },
    { min: 70, label: '¡¡¡Super Saiyajin!!!', color: '#FFD700' },
    { min: 85, label: '¡¡¡SUPER SAIYAJIN DIOS!!! 💥', color: '#FF0000' },
    { min: 95, label: '🌌 ¡¡¡ULTRA INSTINTO!!! 🌌', color: '#E040FB' }
];

function increasePower() {
    const increase = 3 + Math.floor(Math.random() * 8);
    powerLevel = Math.min(100, powerLevel + increase);

    const bar = document.getElementById('power-bar');
    const value = document.getElementById('power-value');
    const rank = document.getElementById('power-rank');
    const aura = document.getElementById('saiyan-aura');

    bar.style.width = `${powerLevel}%`;
    value.textContent = powerLevel * 100;

    let currentRank = powerRanks[0];
    for (const r of powerRanks) { if (powerLevel >= r.min) currentRank = r; }
    rank.textContent = currentRank.label;
    rank.style.color = currentRank.color;

    // Aura effects
    aura.classList.remove('powered-up', 'ultra-instinct');
    if (powerLevel >= 95) aura.classList.add('ultra-instinct');
    else if (powerLevel >= 55) aura.classList.add('powered-up');

    playTone(200 + powerLevel * 8, 0.15, 'sawtooth', 0.15);

    // Screen shake
    const section = document.getElementById('marcos');
    const shakeIntensity = powerLevel >= 70 ? 8 : 4;
    section.style.transform = `translate(${(Math.random() - 0.5) * shakeIntensity}px, ${(Math.random() - 0.5) * shakeIntensity}px)`;
    setTimeout(() => { section.style.transform = ''; }, 100);

    if (powerLevel >= 100) {
        document.getElementById('power-btn').textContent = '🌌 ¡¡¡ULTRA INSTINTO DOMINADO!!! 🌌';
        launchConfetti();
        [800, 1000, 1200, 1400].forEach((f, i) => setTimeout(() => playTone(f, 0.3, 'sine', 0.2), i * 150));
        setTimeout(() => {
            powerLevel = 0;
            bar.style.width = '0%';
            value.textContent = '0';
            rank.textContent = 'Humano normal';
            rank.style.color = '#aaa';
            aura.classList.remove('powered-up', 'ultra-instinct');
            document.getElementById('power-btn').textContent = '¡¡¡AAAAHHH!!! 💥';
        }, 4000);
    }
}

// ============================================
// MARCOS: DRAGON BALL FACTS
// ============================================
let currentFact = 0;
function nextFact() {
    const facts = document.querySelectorAll('#db-facts .fact');
    facts[currentFact].classList.remove('active');
    currentFact = (currentFact + 1) % facts.length;
    facts[currentFact].classList.add('active');
    playTone(500, 0.1, 'sine', 0.15);
}

// ============================================
// MARCOS: SOCCER QUIZ (Real Madrid themed!)
// ============================================
const soccerQuestions = [
    { q: '¿Cuántos jugadores tiene un equipo de fútbol en el campo?', options: ['9', '10', '11', '12'], answer: 2 },
    { q: '¿En qué país se celebró el Mundial 2022?', options: ['Brasil', 'Rusia', 'Qatar', 'Japón'], answer: 2 },
    { q: '¿Cuántas Champions League ha ganado el Real Madrid?', options: ['10', '12', '15', '8'], answer: 2 },
    { q: '¿Cuánto dura un partido de fútbol (tiempo reglamentario)?', options: ['60 min', '80 min', '90 min', '120 min'], answer: 2 },
    { q: '¿Cómo se llama el estadio del Real Madrid?', options: ['Camp Nou', 'San Mamés', 'Santiago Bernabéu', 'Wanda'], answer: 2 },
    { q: '¿Qué selección ha ganado más Mundiales?', options: ['Alemania', 'Argentina', 'Italia', 'Brasil'], answer: 3 },
    { q: '¿Quién es el máximo goleador histórico del Real Madrid?', options: ['Raúl', 'Cristiano Ronaldo', 'Di Stéfano', 'Benzema'], answer: 1 },
    { q: '¿De qué color es la equipación principal del Real Madrid?', options: ['Azul', 'Roja', 'Blanca', 'Negra'], answer: 2 },
    { q: '¿En qué año se fundó el Real Madrid?', options: ['1890', '1902', '1910', '1920'], answer: 1 },
    { q: '¿Qué jugador es conocido como "el Bicho"?', options: ['Messi', 'Neymar', 'Cristiano Ronaldo', 'Mbappé'], answer: 2 },
    { q: '¿Quién fue apodado "La Saeta Rubia"?', options: ['Raúl', 'Di Stéfano', 'Puskas', 'Zidane'], answer: 1 },
    { q: '¿Cuántos metros mide una portería de ancho?', options: ['5.32m', '6.32m', '7.32m', '8.32m'], answer: 2 },
];

let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function loadQuizQuestion() {
    if (quizIndex >= soccerQuestions.length) {
        const record = getRecord('quiz_record');
        if (quizScore > record) {
            saveRecord('quiz_record', quizScore);
            document.getElementById('quiz-record-display').textContent = quizScore;
        }
        quizIndex = 0;
        quizScore = 0;
    }
    quizAnswered = false;
    const q = soccerQuestions[quizIndex];
    document.getElementById('quiz-question').textContent = q.q;
    document.getElementById('quiz-total').textContent = quizIndex + 1;

    const opts = document.getElementById('quiz-options');
    opts.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.onclick = () => checkQuizAnswer(i, btn);
        opts.appendChild(btn);
    });
}

function checkQuizAnswer(selected, btn) {
    if (quizAnswered) return;
    quizAnswered = true;
    const q = soccerQuestions[quizIndex];
    const options = document.querySelectorAll('.quiz-option');

    if (selected === q.answer) {
        btn.classList.add('correct');
        quizScore++;
        playTone(523, 0.15, 'sine', 0.2);
        setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 150);
    } else {
        btn.classList.add('wrong');
        options[q.answer].classList.add('correct');
        playTone(200, 0.3, 'sawtooth', 0.15);
    }
    document.getElementById('quiz-score').textContent = quizScore;
    setTimeout(() => { quizIndex++; loadQuizQuestion(); }, 1500);
}

loadQuizQuestion();

// ============================================
// MARCOS: DRAGON BALL COLLECTOR GAME
// ============================================
let dbGameActive = false;
let dbCollected = 0;
let dbTimer = 30;
let dbInterval = null;
let dbSpawnInterval = null;
let dbStartTime = 0;

const dragonBallEmojis = ['🟠', '🔴', '🟡', '🟢', '🔵', '🟣', '⚪'];

function startDragonBallGame() {
    if (dbGameActive) return;
    dbGameActive = true;
    dbCollected = 0;
    dbTimer = 30;
    dbStartTime = Date.now();

    const area = document.getElementById('db-game-area');
    document.getElementById('db-start').style.display = 'none';
    document.getElementById('db-message').textContent = '';
    document.getElementById('db-collected').textContent = '0';
    document.getElementById('db-timer').textContent = '30';

    area.querySelectorAll('.dragon-ball').forEach(b => b.remove());

    dbInterval = setInterval(() => {
        dbTimer--;
        document.getElementById('db-timer').textContent = dbTimer;
        if (dbTimer <= 0) endDragonBallGame(false);
    }, 1000);

    spawnDragonBall();
    dbSpawnInterval = setInterval(spawnDragonBall, 1200);
}

function spawnDragonBall() {
    if (!dbGameActive) return;
    const area = document.getElementById('db-game-area');
    const rect = area.getBoundingClientRect();
    const ball = document.createElement('div');
    ball.className = 'dragon-ball';
    ball.textContent = dragonBallEmojis[Math.floor(Math.random() * dragonBallEmojis.length)];
    ball.style.left = `${20 + Math.random() * (rect.width - 70)}px`;
    ball.style.top = `${20 + Math.random() * (rect.height - 70)}px`;

    ball.addEventListener('click', (e) => { e.stopPropagation(); if (dbGameActive) collectDragonBall(ball); });
    area.appendChild(ball);

    setTimeout(() => {
        if (ball.parentNode && dbGameActive) {
            ball.style.transition = 'opacity 0.3s, transform 0.3s';
            ball.style.opacity = '0';
            ball.style.transform = 'scale(0.5)';
            setTimeout(() => ball.remove(), 300);
        }
    }, 2500);
}

function collectDragonBall(ball) {
    dbCollected++;
    document.getElementById('db-collected').textContent = dbCollected;
    ball.style.animation = 'dbCollected 0.3s ease-out forwards';
    playTone(400 + dbCollected * 100, 0.2, 'sine', 0.25);
    setTimeout(() => ball.remove(), 300);
    if (dbCollected >= 7) endDragonBallGame(true);
}

function endDragonBallGame(won) {
    dbGameActive = false;
    clearInterval(dbInterval);
    clearInterval(dbSpawnInterval);

    const area = document.getElementById('db-game-area');
    const msg = document.getElementById('db-message');
    area.querySelectorAll('.dragon-ball').forEach(b => b.remove());
    document.getElementById('db-start').style.display = 'inline-block';
    document.getElementById('db-start').textContent = '¡Jugar otra vez!';

    if (won) {
        const elapsed = Math.round((Date.now() - dbStartTime) / 1000);
        msg.textContent = `🐉 ¡¡¡LAS 7 ESFERAS EN ${elapsed}s!!! ¡Pide tu deseo! 🐉`;
        msg.style.color = '#FFD700';
        launchConfetti();
        const best = getRecord('db_best', null);
        if (!best || elapsed < best) {
            saveRecord('db_best', elapsed);
            document.getElementById('db-best').textContent = elapsed;
        }
        [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.3, 'sine', 0.2), i * 150));
    } else {
        msg.textContent = '⏰ ¡Se acabó el tiempo! ¡Inténtalo de nuevo!';
        msg.style.color = '#FF6B6B';
        playTone(200, 0.5, 'sawtooth', 0.15);
    }
}

// ============================================
// MARCOS: PENALTY SHOOTOUT
// ============================================
let penaltyGoals = 0;
let penaltyShots = 0;

function initPenalty() {
    const canvas = document.getElementById('penalty-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function drawGoal() {
        ctx.clearRect(0, 0, 400, 300);

        // Field
        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(0, 0, 400, 300);

        // Goal posts
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 6;
        ctx.strokeRect(50, 30, 300, 200);

        // Crossbar
        ctx.strokeRect(50, 30, 300, 0);

        // Net pattern
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        for (let x = 50; x <= 350; x += 30) {
            ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x, 230); ctx.stroke();
        }
        for (let y = 30; y <= 230; y += 30) {
            ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(350, y); ctx.stroke();
        }

        // Penalty spot
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(200, 270, 4, 0, Math.PI * 2);
        ctx.fill();

        // Ball
        ctx.font = '25px serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚽', 200, 265);

        // "Click to shoot" text
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '14px Poppins, sans-serif';
        ctx.fillText('¡Haz clic en la portería para tirar!', 200, 290);
    }

    drawGoal();

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = 400 / rect.width;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * (300 / rect.height);

        // Only count if clicked within goal area
        if (x < 50 || x > 350 || y < 30 || y > 230) return;

        penaltyShots++;
        document.getElementById('penalty-shots').textContent = penaltyShots;

        // Goalkeeper dives to random position
        const keeperX = 100 + Math.random() * 200;
        const keeperY = 80 + Math.random() * 100;

        // Check if save (within 60px of keeper)
        const dist = Math.sqrt((x - keeperX) ** 2 + (y - keeperY) ** 2);
        const saved = dist < 60;

        // Animate
        drawGoal();

        // Draw ball at shot position
        ctx.font = '30px serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚽', x, y);

        // Draw goalkeeper
        ctx.font = '40px serif';
        ctx.fillText('🧤', keeperX, keeperY);

        const msg = document.getElementById('penalty-message');
        if (saved) {
            msg.textContent = '🧤 ¡Parada del portero!';
            msg.style.color = '#FF6B6B';
            playTone(200, 0.3, 'sawtooth', 0.15);
        } else {
            penaltyGoals++;
            document.getElementById('penalty-goals').textContent = penaltyGoals;
            msg.textContent = '⚽ ¡¡¡GOOOOOL!!! ¡Hala Madrid!';
            msg.style.color = '#FFD700';
            playTone(523, 0.15, 'sine', 0.2);
            setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 100);
            setTimeout(() => playTone(784, 0.2, 'sine', 0.2), 200);

            const rec = getRecord('penalty_record');
            if (penaltyGoals > rec) {
                saveRecord('penalty_record', penaltyGoals);
                document.getElementById('penalty-record').textContent = penaltyGoals;
            }
        }

        // Reset field after 1.5s
        setTimeout(drawGoal, 1500);
    });
}
initPenalty();

// ============================================
// MARCOS: DB CHARACTER QUIZ
// ============================================
const dbCharacters = [
    { name: 'Goku', clues: '🥋 Guerrero Saiyajin criado en la Tierra. Le encanta comer y luchar. Su técnica más famosa es el Kamehameha.' },
    { name: 'Vegeta', clues: '👑 Príncipe de los Saiyajins. Muy orgulloso. Su técnica es el Final Flash. Rival de Goku.' },
    { name: 'Piccolo', clues: '💚 Es verde y del planeta Namek. Fue maestro de Gohan. Puede regenerar sus extremidades.' },
    { name: 'Krilin', clues: '👨‍🦲 No tiene nariz. Es el mejor amigo de Goku. El humano más fuerte del universo.' },
    { name: 'Gohan', clues: '📚 Hijo de Goku. Le gusta más estudiar que luchar. Derrotó a Cell cuando era niño.' },
    { name: 'Freezer', clues: '❄️ Villano intergaláctico. Tiene muchas transformaciones. Destruyó el planeta Vegeta.' },
    { name: 'Cell', clues: '🦠 Androide creado por el Dr. Gero. Tiene células de muchos guerreros. Puede regenerarse.' },
    { name: 'Majin Buu', clues: '🍬 Le encanta comer dulces. Es rosado. Puede convertir a la gente en chocolate.' },
    { name: 'Trunks', clues: '⚔️ Hijo de Vegeta. Viajó al pasado desde el futuro. Usa una espada.' },
    { name: 'Broly', clues: '💪 Saiyajin legendario. Tiene un poder descomunal. Nació con un nivel de poder de 10.000.' },
];

let dbCharIndex = 0;
let dbCharScore = 0;
let dbCharAnswered = false;

function loadDbCharQuiz() {
    dbCharAnswered = false;
    const char = dbCharacters[dbCharIndex % dbCharacters.length];
    document.getElementById('db-char-clue').textContent = char.clues;
    document.getElementById('db-char-message').textContent = '';

    // Generate 4 options including correct
    const options = [char.name];
    while (options.length < 4) {
        const rand = dbCharacters[Math.floor(Math.random() * dbCharacters.length)].name;
        if (!options.includes(rand)) options.push(rand);
    }
    // Shuffle
    options.sort(() => Math.random() - 0.5);

    const container = document.getElementById('db-char-options');
    container.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'db-char-option';
        btn.textContent = opt;
        btn.onclick = () => checkDbChar(opt, char.name, btn);
        container.appendChild(btn);
    });
}

function checkDbChar(selected, correct, btn) {
    if (dbCharAnswered) return;
    dbCharAnswered = true;
    const msg = document.getElementById('db-char-message');
    const options = document.querySelectorAll('.db-char-option');

    if (selected === correct) {
        btn.classList.add('correct');
        dbCharScore++;
        document.getElementById('db-char-score').textContent = dbCharScore;
        msg.textContent = '¡¡Correcto!! 🎉';
        msg.style.color = '#FFD700';
        playTone(523, 0.15, 'sine', 0.2);

        const rec = getRecord('db_char_record');
        if (dbCharScore > rec) {
            saveRecord('db_char_record', dbCharScore);
            document.getElementById('db-char-record').textContent = dbCharScore;
        }
    } else {
        btn.classList.add('wrong');
        options.forEach(o => { if (o.textContent === correct) o.classList.add('correct'); });
        msg.textContent = `¡Era ${correct}! 😅`;
        msg.style.color = '#FF6B6B';
        dbCharScore = 0;
        document.getElementById('db-char-score').textContent = 0;
        playTone(200, 0.3, 'sawtooth', 0.15);
    }

    setTimeout(() => { dbCharIndex++; loadDbCharQuiz(); }, 2000);
}

loadDbCharQuiz();

// ============================================
// CLAUDIA: DANCE FACTS
// ============================================
let currentDanceFact = 0;
function nextDanceFact() {
    const facts = document.querySelectorAll('#dance-facts .fact');
    facts[currentDanceFact].classList.remove('active');
    currentDanceFact = (currentDanceFact + 1) % facts.length;
    facts[currentDanceFact].classList.add('active');
    playTone(600, 0.1, 'sine', 0.15);
}

// ============================================
// CLAUDIA: PIANO
// ============================================
const noteFrequencies = {
    'C': 261.63, 'Cs': 277.18, 'D': 293.66, 'Ds': 311.13,
    'E': 329.63, 'F': 349.23, 'Fs': 369.99, 'G': 392.00,
    'Gs': 415.30, 'A': 440.00, 'As': 466.16, 'B': 493.88
};

function playNote(note) {
    const freq = noteFrequencies[note];
    if (freq) {
        playTone(freq, 0.5, 'sine', 0.35);
        const key = document.querySelector(`[data-note="${note}"]`);
        if (key) { key.classList.add('pressed'); setTimeout(() => key.classList.remove('pressed'), 200); }
    }
}

// ============================================
// CLAUDIA: SIMON SAYS
// ============================================
let simonSequence = [];
let simonPlayerIndex = 0;
let simonRound = 0;
let simonRecord = getRecord('simon_record');
let simonPlaying = false;
let simonListening = false;

const simonColors = [
    { freq: 329.63 }, { freq: 440.00 }, { freq: 523.25 }, { freq: 659.25 }
];

function startSimon() {
    if (simonPlaying) return;
    simonSequence = [];
    simonRound = 0;
    document.getElementById('simon-message').textContent = '';
    document.getElementById('simon-round').textContent = '0';
    simonNextRound();
}

function simonNextRound() {
    simonRound++;
    simonPlaying = true;
    simonListening = false;
    simonPlayerIndex = 0;
    document.getElementById('simon-round').textContent = simonRound;
    document.getElementById('simon-start').style.display = 'none';

    simonSequence.push(Math.floor(Math.random() * 4));
    document.querySelectorAll('.simon-btn').forEach(b => b.disabled = true);

    let delay = 600;
    simonSequence.forEach((idx, i) => {
        setTimeout(() => flashSimonButton(idx), delay * (i + 1));
    });

    setTimeout(() => {
        simonPlaying = false;
        simonListening = true;
        document.querySelectorAll('.simon-btn').forEach(b => b.disabled = false);
        document.getElementById('simon-message').textContent = '¡Tu turno!';
        document.getElementById('simon-message').style.color = '#FFD700';
    }, delay * (simonSequence.length + 1));
}

function flashSimonButton(index) {
    const btn = document.getElementById(`simon-${index}`);
    btn.classList.add('flash');
    playTone(simonColors[index].freq, 0.3, 'sine', 0.3);
    setTimeout(() => btn.classList.remove('flash'), 400);
}

function simonInput(index) {
    if (!simonListening || simonPlaying) return;
    flashSimonButton(index);

    if (simonSequence[simonPlayerIndex] === index) {
        simonPlayerIndex++;
        if (simonPlayerIndex === simonSequence.length) {
            simonListening = false;
            document.getElementById('simon-message').textContent = '¡¡Correcto!! 🎉';
            document.getElementById('simon-message').style.color = '#4CAF50';

            if (simonRound > simonRecord) {
                simonRecord = simonRound;
                saveRecord('simon_record', simonRecord);
                document.getElementById('simon-record').textContent = simonRecord;
            }

            if (simonRound % 5 === 0) launchConfetti();
            setTimeout(simonNextRound, 1000);
        }
    } else {
        simonListening = false;
        document.getElementById('simon-message').textContent = `¡Fallaste en ronda ${simonRound}! 😅`;
        document.getElementById('simon-message').style.color = '#FF6B6B';
        document.getElementById('simon-start').style.display = 'inline-block';
        document.getElementById('simon-start').textContent = '¡Intentar de nuevo!';
        playTone(150, 0.5, 'sawtooth', 0.2);
    }
}

// ============================================
// CLAUDIA: RHYTHM GAME
// ============================================
let rhythmActive = false;
let rhythmScore = 0;
let rhythmCombo = 0;
let rhythmNotes = [];
let rhythmSpawnInterval = null;
let rhythmAnimFrame = null;
let rhythmGameTimer = null;

const rhythmKeys = ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight'];
const rhythmSymbols = { ArrowLeft: '←', ArrowUp: '↑', ArrowDown: '↓', ArrowRight: '→' };
const rhythmLanePositions = {};

function calculateRhythmPositions() {
    const lanes = document.querySelectorAll('.rhythm-lane');
    const area = document.getElementById('rhythm-area');
    if (!area) return;
    const areaRect = area.getBoundingClientRect();
    lanes.forEach(lane => {
        const rect = lane.getBoundingClientRect();
        rhythmLanePositions[lane.dataset.key] = {
            x: rect.left - areaRect.left + rect.width / 2 - 25,
            hitY: rect.top - areaRect.top
        };
    });
}

function startRhythmGame() {
    if (rhythmActive) return;
    rhythmActive = true;
    rhythmScore = 0;
    rhythmCombo = 0;
    rhythmNotes = [];
    document.getElementById('rhythm-score').textContent = '0';
    document.getElementById('rhythm-combo').textContent = '0';
    document.getElementById('rhythm-message').textContent = '';
    document.getElementById('rhythm-feedback').textContent = '';
    document.getElementById('rhythm-start').style.display = 'none';
    document.getElementById('rhythm-notes').innerHTML = '';

    calculateRhythmPositions();

    let notesSpawned = 0;
    const totalNotes = 30;

    rhythmSpawnInterval = setInterval(() => {
        if (notesSpawned >= totalNotes) {
            clearInterval(rhythmSpawnInterval);
            return;
        }
        spawnRhythmNote();
        notesSpawned++;
    }, 800);

    rhythmAnimFrame = requestAnimationFrame(updateRhythm);

    rhythmGameTimer = setTimeout(() => {
        endRhythmGame();
    }, 35000);
}

function spawnRhythmNote() {
    const key = rhythmKeys[Math.floor(Math.random() * rhythmKeys.length)];
    const pos = rhythmLanePositions[key];
    if (!pos) return;

    const note = document.createElement('div');
    note.className = 'rhythm-note';
    note.dataset.key = key;
    note.textContent = rhythmSymbols[key];
    note.style.left = `${pos.x}px`;
    note.style.top = '-50px';

    document.getElementById('rhythm-notes').appendChild(note);
    rhythmNotes.push({ el: note, key, y: -50, hit: false });
}

function updateRhythm() {
    if (!rhythmActive) return;

    rhythmNotes.forEach(note => {
        if (note.hit) return;
        note.y += 2; // Slower speed for easier gameplay
        note.el.style.top = `${note.y}px`;

        // Missed - more generous threshold
        if (note.y > 400) {
            note.hit = true;
            note.el.style.opacity = '0.2';
            rhythmCombo = 0;
            document.getElementById('rhythm-combo').textContent = '0';
        }
    });

    rhythmAnimFrame = requestAnimationFrame(updateRhythm);
}

function endRhythmGame() {
    rhythmActive = false;
    clearInterval(rhythmSpawnInterval);
    clearTimeout(rhythmGameTimer);
    cancelAnimationFrame(rhythmAnimFrame);

    const msg = document.getElementById('rhythm-message');
    msg.textContent = `🎶 ¡Fin! Puntuación: ${rhythmScore}`;
    msg.style.color = '#FFD700';

    document.getElementById('rhythm-start').style.display = 'inline-block';
    document.getElementById('rhythm-start').textContent = '¡Otra vez!';

    const rec = getRecord('rhythm_record');
    if (rhythmScore > rec) {
        saveRecord('rhythm_record', rhythmScore);
        document.getElementById('rhythm-record').textContent = rhythmScore;
        launchConfetti();
    }
}

// Shared hit-check logic for both keyboard and touch/click
function handleRhythmHit(key) {
    if (!rhythmActive) return;

    const lane = document.querySelector(`.rhythm-lane[data-key="${key}"]`);
    const hitY = rhythmLanePositions[key]?.hitY || 250;

    // Find closest unhit note for this key
    let closest = null;
    let closestDist = Infinity;

    rhythmNotes.forEach(note => {
        if (note.hit || note.key !== key) return;
        const dist = Math.abs(note.y - hitY);
        if (dist < closestDist) { closestDist = dist; closest = note; }
    });

    const feedback = document.getElementById('rhythm-feedback');

    // Much more generous tolerance: 90px
    if (closest && closestDist < 90) {
        closest.hit = true;
        closest.el.remove();

        let points = 0;
        let text = '';
        if (closestDist < 25) { points = 100; text = '¡¡PERFECTO!! ✨'; feedback.style.color = '#FFD700'; }
        else if (closestDist < 50) { points = 50; text = '¡Genial! 🎵'; feedback.style.color = '#4CAF50'; }
        else { points = 25; text = '¡Bien! 👍'; feedback.style.color = '#4FC3F7'; }

        rhythmCombo++;
        points += rhythmCombo * 5;
        rhythmScore += points;

        document.getElementById('rhythm-score').textContent = rhythmScore;
        document.getElementById('rhythm-combo').textContent = rhythmCombo;
        feedback.textContent = `${text} +${points}`;

        if (lane) {
            lane.classList.add('hit');
            setTimeout(() => lane.classList.remove('hit'), 200);
        }

        playTone(400 + rhythmCombo * 20, 0.15, 'sine', 0.2);
    } else {
        rhythmCombo = 0;
        document.getElementById('rhythm-combo').textContent = '0';
        feedback.textContent = '¡Fallo! 💨';
        feedback.style.color = '#FF6B6B';

        if (lane) {
            lane.classList.add('miss');
            setTimeout(() => lane.classList.remove('miss'), 200);
        }
    }
}

// Tap/click handler for mobile and desktop
function rhythmTap(key) {
    handleRhythmHit(key);
}

// Keyboard handler
document.addEventListener('keydown', (e) => {
    if (!rhythmActive) return;
    if (!rhythmKeys.includes(e.key)) return;
    e.preventDefault();
    handleRhythmHit(e.key);
});

// ============================================
// CLAUDIA: KARAOKE
// ============================================
const karaokeSongs = [
    {
        title: 'Cumpleaños Feliz',
        lyrics: 'Cumpleaños feliz, cumpleaños feliz, te deseamos todos, cumpleaños feliz',
        tempo: 500
    },
    {
        title: 'Estrellita',
        lyrics: 'Estrellita dónde estás, me pregunto qué serás, en el cielo y en el mar, un diamante de verdad',
        tempo: 450
    },
    {
        title: 'Sol Solecito',
        lyrics: 'Sol solecito, caliéntame un poquito, por hoy por mañana, por toda la semana',
        tempo: 400
    }
];

let karaokeSelected = null;
let karaokeTimer = null;
let karaokeWordIndex = 0;

function loadKaraoke(index) {
    karaokeSelected = karaokeSongs[index];
    const display = document.getElementById('karaoke-display');
    const words = karaokeSelected.lyrics.split(' ');

    display.innerHTML = words.map((w, i) =>
        `<span class="karaoke-word" id="kw-${i}">${w}</span>`
    ).join(' ');

    document.getElementById('karaoke-play').disabled = false;
    karaokeWordIndex = 0;
    playTone(500, 0.1, 'sine', 0.15);
}

function playKaraoke() {
    if (!karaokeSelected) return;
    karaokeWordIndex = 0;
    const words = karaokeSelected.lyrics.split(' ');

    // Reset all words
    words.forEach((_, i) => {
        const el = document.getElementById(`kw-${i}`);
        if (el) { el.classList.remove('active', 'sung'); }
    });

    clearInterval(karaokeTimer);
    karaokeTimer = setInterval(() => {
        if (karaokeWordIndex > 0) {
            const prev = document.getElementById(`kw-${karaokeWordIndex - 1}`);
            if (prev) { prev.classList.remove('active'); prev.classList.add('sung'); }
        }

        if (karaokeWordIndex >= words.length) {
            clearInterval(karaokeTimer);
            launchConfetti();
            return;
        }

        const current = document.getElementById(`kw-${karaokeWordIndex}`);
        if (current) current.classList.add('active');

        // Play a note for each word
        const noteIdx = karaokeWordIndex % 8;
        const scale = [261, 293, 329, 349, 392, 440, 493, 523];
        playTone(scale[noteIdx], 0.3, 'sine', 0.2);

        karaokeWordIndex++;
    }, karaokeSelected.tempo);
}

// ============================================
// ALVARO: BUBBLE POP
// ============================================
let bubbleCount = 0;
let bubbleInterval = null;

const bubbleColors = [
    'rgba(255,107,107,0.7)', 'rgba(78,205,196,0.7)', 'rgba(255,230,109,0.7)',
    'rgba(167,139,250,0.7)', 'rgba(96,165,250,0.7)', 'rgba(249,115,22,0.7)',
    'rgba(244,114,182,0.7)', 'rgba(52,211,153,0.7)'
];
const bubbleEmojis = ['⭐', '🌟', '💖', '🎈', '🌸', '🦋', '🐣', '🍭'];

function startBubbles() {
    if (bubbleInterval) return;
    bubbleInterval = setInterval(spawnBubble, 800);
    for (let i = 0; i < 3; i++) setTimeout(spawnBubble, i * 200);
}

function spawnBubble() {
    const container = document.getElementById('bubbles-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = 50 + Math.random() * 40;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.background = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    bubble.textContent = bubbleEmojis[Math.floor(Math.random() * bubbleEmojis.length)];
    bubble.style.left = `${10 + Math.random() * (rect.width - size - 20)}px`;
    bubble.style.fontSize = `${size * 0.4}px`;
    bubble.style.animationDuration = `${3 + Math.random() * 3}s`;

    const pop = (e) => { e.preventDefault(); e.stopPropagation(); popBubble(bubble); };
    bubble.addEventListener('click', pop);
    bubble.addEventListener('touchstart', pop, { passive: false });

    container.appendChild(bubble);
    setTimeout(() => { if (bubble.parentNode) bubble.remove(); }, 6000);
}

function popBubble(bubble) {
    if (bubble.dataset.popped) return;
    bubble.dataset.popped = 'true';
    bubbleCount++;
    document.getElementById('bubble-count').textContent = bubbleCount;
    saveRecord('bubble_count', bubbleCount);
    playTone(600 + Math.random() * 400, 0.15, 'sine', 0.25);
    bubble.style.animation = 'bubblePop 0.3s ease-out forwards';
    setTimeout(() => bubble.remove(), 300);

    if (bubbleCount % 25 === 0) launchConfetti();
}

const alvaroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) startBubbles();
        else { clearInterval(bubbleInterval); bubbleInterval = null; }
    });
}, { threshold: 0.3 });

const alvaroSection = document.getElementById('alvaro');
if (alvaroSection) alvaroObserver.observe(alvaroSection);

// ============================================
// ALVARO: ANIMAL SOUNDS
// ============================================
function animalSound(emoji, sound) {
    const display = document.getElementById('animal-display');
    display.innerHTML = `
        <span style="font-size:4rem;display:block;animation:bounceIn 0.5s ease">${emoji}</span>
        <span style="animation:fadeIn 0.3s ease">${sound}</span>
    `;

    const tones = {
        '🐶': [400, 500], '🐱': [600, 700], '🐮': [150, 130], '🐷': [350, 300, 350],
        '🐸': [250, 350, 250], '🦁': [100, 120, 100], '🐔': [500, 600, 700, 500], '🦆': [400, 350, 400]
    };

    (tones[emoji] || [400, 500]).forEach((f, i) => setTimeout(() => playTone(f, 0.2, 'triangle', 0.25), i * 150));

    if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(sound);
        u.lang = 'es-ES'; u.rate = 0.8; u.pitch = 1.5;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
    }
}

// ============================================
// ALVARO: SHAPES
// ============================================
function showShape(name, color, symbol, colorName) {
    const display = document.getElementById('shape-display');
    display.style.borderColor = color;
    display.style.boxShadow = `0 0 30px ${color}40`;
    display.innerHTML = `
        <span class="big-shape" style="color:${color}">${symbol}</span>
        <span class="shape-label" style="color:${color}">${name} - ${colorName}</span>
    `;
    playTone(300 + Math.random() * 400, 0.25, 'triangle', 0.2);

    if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(`${name}, color ${colorName}`);
        u.lang = 'es-ES'; u.rate = 0.7; u.pitch = 1.3;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
    }
}

// ============================================
// ALVARO: COUNTING GAME
// ============================================
let countingAnswer = 0;

function startCounting() {
    const num = 1 + Math.floor(Math.random() * 5);
    countingAnswer = num;

    const display = document.getElementById('counting-display');
    const emojis = ['⭐', '🌟', '💫', '✨', '🌈'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    display.innerHTML = Array(num).fill(`<span style="animation:bounceIn 0.5s ease">${emoji}</span>`).join(' ');

    document.getElementById('counting-question').textContent = '¿Cuántas hay?';
    document.getElementById('counting-message').textContent = '';
    document.getElementById('counting-start').style.display = 'none';

    const btns = document.getElementById('counting-buttons');
    btns.innerHTML = '';
    const options = new Set([num]);
    while (options.size < 4) options.add(1 + Math.floor(Math.random() * 5));
    [...options].sort(() => Math.random() - 0.5).forEach(n => {
        const btn = document.createElement('button');
        btn.className = 'counting-num-btn';
        btn.textContent = n;
        btn.onclick = () => checkCounting(n, btn);
        btns.appendChild(btn);
    });

    if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance('¿Cuántas hay?');
        u.lang = 'es-ES'; u.rate = 0.7; u.pitch = 1.3;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
    }
}

function checkCounting(selected, btn) {
    const msg = document.getElementById('counting-message');
    if (selected === countingAnswer) {
        btn.classList.add('correct');
        msg.textContent = '¡¡MUY BIEN!! 🎉';
        msg.style.color = '#4CAF50';
        playTone(523, 0.15, 'sine', 0.25);
        setTimeout(() => playTone(659, 0.15, 'sine', 0.25), 100);
        launchConfetti();

        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance('¡Muy bien!');
            u.lang = 'es-ES'; u.rate = 0.8; u.pitch = 1.5;
            setTimeout(() => speechSynthesis.speak(u), 300);
        }

        setTimeout(() => {
            document.getElementById('counting-start').style.display = 'inline-block';
            document.getElementById('counting-start').textContent = '¡Otra vez!';
        }, 1500);
    } else {
        btn.classList.add('wrong');
        msg.textContent = '¡Inténtalo otra vez! 💪';
        msg.style.color = '#EF5350';
        playTone(200, 0.2, 'sawtooth', 0.15);
        setTimeout(() => btn.classList.remove('wrong'), 500);
    }
}

// ============================================
// ALVARO: DRAWING CANVAS
// ============================================
let drawColor = '#FF6B6B';
let drawSize = 8;
let isDrawing = false;

function setDrawColor(color, btn) {
    drawColor = color;
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function setDrawSize(size, btn) {
    drawSize = size;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function clearDrawing() {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playTone(400, 0.1, 'sine', 0.15);
}

function initDrawing() {
    const canvas = document.getElementById('drawing-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    }

    function draw(e) {
        if (!isDrawing) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }

    function startDraw(e) {
        isDrawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function stopDraw() { isDrawing = false; ctx.beginPath(); }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
    canvas.addEventListener('touchend', stopDraw);
}
initDrawing();

// ============================================
// KONAMI CODE EASTER EGG
// ============================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateKonami();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateKonami() {
    const overlay = document.getElementById('konami-overlay');
    overlay.classList.remove('hidden');

    // Rain emojis
    const rain = document.getElementById('konami-rain');
    rain.innerHTML = '';
    const emojis = ['🐉', '⚽', '💃', '🧸', '⭐', '🔥', '🎵', '🌟', '💖', '🏆'];
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('span');
        drop.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        drop.style.position = 'absolute';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.top = `${Math.random() * 100}%`;
        drop.style.fontSize = `${1.5 + Math.random() * 2}rem`;
        drop.style.animation = `floatAround ${3 + Math.random() * 4}s ease-in-out infinite`;
        drop.style.animationDelay = `${Math.random() * 3}s`;
        rain.appendChild(drop);
    }

    launchConfetti();
    [523, 659, 784, 1047, 1318].forEach((f, i) => setTimeout(() => playTone(f, 0.3, 'sine', 0.25), i * 100));
}

function closeKonami() {
    document.getElementById('konami-overlay').classList.add('hidden');
}

// ============================================
// INITIALIZATION
// ============================================
loadSavedRecords();
