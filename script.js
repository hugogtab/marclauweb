/* ============================================
   LA MEJOR PÁGINA WEB DEL MUNDO
   Navigation, animations, and mini-games
   ============================================ */

// ============ AUDIO CONTEXT (Web Audio API) ============
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
    } catch (e) {
        // Audio not supported, silently fail
    }
}

// ============ NAVIGATION & SCROLL ============
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

// Intersection Observer for active nav
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === id);
            });
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// Smooth scroll for nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Smooth scroll for kid cards
document.querySelectorAll('.kid-card, .back-home').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(card.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ============ FLOATING ELEMENTS ============
const floatingConfig = {
    'home-floats': ['✨', '⭐', '🌟', '💫', '🎉', '🎊', '❤️', '🌈'],
    'marcos-floats': ['⚽', '🐉', '⭐', '🏆', '💪', '🔥', '⚡', '🥇'],
    'claudia-floats': ['🎵', '🎶', '💃', '🌸', '✨', '💖', '🦋', '🎀'],
    'alvaro-floats': ['⭐', '🌙', '☁️', '🧸', '🌈', '🎈', '🍼', '💝']
};

function createFloatingElements() {
    Object.entries(floatingConfig).forEach(([containerId, emojis]) => {
        const container = document.getElementById(containerId);
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
            item.style.opacity = `${0.2 + Math.random() * 0.4}`;
            container.appendChild(item);
        }
    });
}

createFloatingElements();

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

// ============ DANCE FLOOR TILES ============
function createDanceTiles() {
    const container = document.getElementById('dance-tiles');
    if (!container) return;
    for (let i = 0; i < 12; i++) {
        const tile = document.createElement('div');
        tile.className = 'dance-tile';
        container.appendChild(tile);
    }

    // Random tile lighting
    setInterval(() => {
        const tiles = container.querySelectorAll('.dance-tile');
        const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        const colors = ['rgba(255,105,180,0.4)', 'rgba(200,100,255,0.4)', 'rgba(255,215,0,0.4)', 'rgba(0,200,255,0.4)'];
        randomTile.style.background = colors[Math.floor(Math.random() * colors.length)];
        randomTile.classList.add('lit');
        setTimeout(() => {
            randomTile.style.background = 'rgba(255,255,255,0.05)';
            randomTile.classList.remove('lit');
        }, 500);
    }, 400);
}

createDanceTiles();

// ============================================
// MARCOS: POWER LEVEL
// ============================================
let powerLevel = 0;
const powerRanks = [
    { min: 0, label: 'Humano normal', color: '#aaa' },
    { min: 10, label: '¡Estudiante de artes marciales!', color: '#FFD700' },
    { min: 25, label: '¡Nivel Krilin!', color: '#FFA000' },
    { min: 40, label: '¡Nivel Piccolo!', color: '#4CAF50' },
    { min: 55, label: '¡¡Nivel Vegeta!!', color: '#2196F3' },
    { min: 70, label: '¡¡¡Super Saiyajin!!!', color: '#FFD700' },
    { min: 85, label: '💥 ¡¡¡SUPER SAIYAJIN DIOS!!! 💥', color: '#FF0000' },
    { min: 95, label: '🌌 ¡¡¡ULTRA INSTINTO!!! 🌌', color: '#E040FB' }
];

function increasePower() {
    const increase = 3 + Math.floor(Math.random() * 8);
    powerLevel = Math.min(100, powerLevel + increase);

    const bar = document.getElementById('power-bar');
    const value = document.getElementById('power-value');
    const rank = document.getElementById('power-rank');

    bar.style.width = `${powerLevel}%`;
    value.textContent = powerLevel * 100;

    // Find current rank
    let currentRank = powerRanks[0];
    for (const r of powerRanks) {
        if (powerLevel >= r.min) currentRank = r;
    }
    rank.textContent = currentRank.label;
    rank.style.color = currentRank.color;

    // Sound effect - rising pitch
    playTone(200 + powerLevel * 8, 0.15, 'sawtooth', 0.15);

    // Screen shake effect
    const section = document.getElementById('marcos');
    section.style.transform = `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 4}px)`;
    setTimeout(() => { section.style.transform = ''; }, 100);

    if (powerLevel >= 100) {
        document.getElementById('power-btn').textContent = '🌌 ¡¡¡ULTRA INSTINTO DOMINADO!!! 🌌';
        playTone(800, 0.5, 'sawtooth', 0.2);
        setTimeout(() => {
            playTone(1000, 0.5, 'sawtooth', 0.2);
        }, 200);
        setTimeout(() => {
            powerLevel = 0;
            bar.style.width = '0%';
            value.textContent = '0';
            rank.textContent = 'Humano normal';
            rank.style.color = '#aaa';
            document.getElementById('power-btn').textContent = '¡¡¡AAAAHHH!!! 💥';
        }, 3000);
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
// MARCOS: SOCCER QUIZ
// ============================================
const soccerQuestions = [
    { q: '¿Cuántos jugadores tiene un equipo de fútbol en el campo?', options: ['9', '10', '11', '12'], answer: 2 },
    { q: '¿En qué país se celebró el Mundial 2022?', options: ['Brasil', 'Rusia', 'Qatar', 'Japón'], answer: 2 },
    { q: '¿Quién tiene más Balones de Oro?', options: ['Cristiano Ronaldo', 'Messi', 'Pelé', 'Maradona'], answer: 1 },
    { q: '¿Cuánto dura un partido de fútbol (tiempo reglamentario)?', options: ['60 minutos', '80 minutos', '90 minutos', '120 minutos'], answer: 2 },
    { q: '¿De qué color es la tarjeta de expulsión?', options: ['Amarilla', 'Roja', 'Azul', 'Verde'], answer: 1 },
    { q: '¿Qué selección ha ganado más Mundiales?', options: ['Alemania', 'Argentina', 'Italia', 'Brasil'], answer: 3 },
    { q: '¿Cómo se llama la máxima competición de clubes en Europa?', options: ['Europa League', 'Champions League', 'La Liga', 'Premier League'], answer: 1 },
    { q: '¿Cuál es el estadio del Real Madrid?', options: ['Camp Nou', 'San Mamés', 'Santiago Bernabéu', 'Wanda Metropolitano'], answer: 2 },
    { q: '¿Qué jugador es conocido como "el Bicho"?', options: ['Messi', 'Neymar', 'Cristiano Ronaldo', 'Mbappé'], answer: 2 },
    { q: '¿Cuántos metros mide una portería de ancho?', options: ['5.32m', '6.32m', '7.32m', '8.32m'], answer: 2 },
];

let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function loadQuizQuestion() {
    if (quizIndex >= soccerQuestions.length) {
        quizIndex = 0;
        quizScore = 0;
    }
    quizAnswered = false;
    const q = soccerQuestions[quizIndex];
    document.getElementById('quiz-question').textContent = q.q;
    document.getElementById('quiz-total').textContent = quizIndex + 1;

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.onclick = () => checkQuizAnswer(i, btn);
        optionsContainer.appendChild(btn);
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

    setTimeout(() => {
        quizIndex++;
        loadQuizQuestion();
    }, 1500);
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

const dragonBallEmojis = ['🟠', '🔴', '🟡', '🟢', '🔵', '🟣', '⚪'];

function startDragonBallGame() {
    if (dbGameActive) return;
    dbGameActive = true;
    dbCollected = 0;
    dbTimer = 30;

    const area = document.getElementById('db-game-area');
    const startBtn = document.getElementById('db-start');
    const message = document.getElementById('db-message');

    startBtn.style.display = 'none';
    message.textContent = '';
    document.getElementById('db-collected').textContent = '0';
    document.getElementById('db-timer').textContent = '30';

    // Clear existing balls
    area.querySelectorAll('.dragon-ball').forEach(b => b.remove());

    // Timer
    dbInterval = setInterval(() => {
        dbTimer--;
        document.getElementById('db-timer').textContent = dbTimer;
        if (dbTimer <= 0) {
            endDragonBallGame(false);
        }
    }, 1000);

    // Spawn balls
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

    const maxX = rect.width - 60;
    const maxY = rect.height - 60;
    ball.style.left = `${20 + Math.random() * maxX}px`;
    ball.style.top = `${20 + Math.random() * maxY}px`;

    ball.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!dbGameActive) return;
        collectDragonBall(ball);
    });

    area.appendChild(ball);

    // Auto-remove after 2.5s if not collected
    setTimeout(() => {
        if (ball.parentNode && dbGameActive) {
            ball.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            ball.style.opacity = '0';
            ball.style.transform = 'scale(0.5)';
            setTimeout(() => ball.remove(), 300);
        }
    }, 2500);
}

function collectDragonBall(ball) {
    dbCollected++;
    document.getElementById('db-collected').textContent = dbCollected;

    // Pop animation
    ball.style.animation = 'dbCollected 0.3s ease-out forwards';
    playTone(400 + dbCollected * 100, 0.2, 'sine', 0.25);
    setTimeout(() => ball.remove(), 300);

    if (dbCollected >= 7) {
        endDragonBallGame(true);
    }
}

function endDragonBallGame(won) {
    dbGameActive = false;
    clearInterval(dbInterval);
    clearInterval(dbSpawnInterval);

    const area = document.getElementById('db-game-area');
    const startBtn = document.getElementById('db-start');
    const message = document.getElementById('db-message');

    area.querySelectorAll('.dragon-ball').forEach(b => b.remove());
    startBtn.style.display = 'inline-block';
    startBtn.textContent = '¡Jugar otra vez!';

    if (won) {
        message.textContent = '🐉 ¡¡¡HAS REUNIDO LAS 7 ESFERAS!!! ¡Pide tu deseo! 🐉';
        message.style.color = '#FFD700';
        // Victory sound
        [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.3, 'sine', 0.2), i * 150);
        });
    } else {
        message.textContent = '⏰ ¡Se acabó el tiempo! ¡Inténtalo de nuevo!';
        message.style.color = '#FF6B6B';
        playTone(200, 0.5, 'sawtooth', 0.15);
    }
}

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

        // Visual feedback
        const key = document.querySelector(`[data-note="${note}"]`);
        if (key) {
            key.classList.add('pressed');
            setTimeout(() => key.classList.remove('pressed'), 200);
        }
    }
}

// ============================================
// CLAUDIA: SIMON SAYS MUSICAL
// ============================================
let simonSequence = [];
let simonPlayerIndex = 0;
let simonRound = 0;
let simonRecord = 0;
let simonPlaying = false;
let simonListening = false;

const simonColors = [
    { freq: 329.63, color: '#FF69B4' },  // E - Pink
    { freq: 440.00, color: '#E040FB' },  // A - Purple
    { freq: 523.25, color: '#FFD700' },  // C5 - Gold
    { freq: 659.25, color: '#4FC3F7' }   // E5 - Blue
];

function startSimon() {
    if (simonPlaying) return;
    simonSequence = [];
    simonRound = 0;
    simonPlayerIndex = 0;
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

    // Add a new random button to the sequence
    simonSequence.push(Math.floor(Math.random() * 4));

    // Disable buttons during playback
    document.querySelectorAll('.simon-btn').forEach(b => b.disabled = true);

    // Play the sequence
    let delay = 600;
    simonSequence.forEach((index, i) => {
        setTimeout(() => {
            flashSimonButton(index);
        }, delay * (i + 1));
    });

    // Enable input after sequence plays
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
            // Round complete!
            simonListening = false;
            document.getElementById('simon-message').textContent = '¡¡Correcto!! 🎉';
            document.getElementById('simon-message').style.color = '#4CAF50';

            if (simonRound > simonRecord) {
                simonRecord = simonRound;
                document.getElementById('simon-record').textContent = simonRecord;
            }

            setTimeout(simonNextRound, 1000);
        }
    } else {
        // Wrong!
        simonListening = false;
        document.getElementById('simon-message').textContent = `¡Fallaste! Llegaste a la ronda ${simonRound} 😅`;
        document.getElementById('simon-message').style.color = '#FF6B6B';
        document.getElementById('simon-start').style.display = 'inline-block';
        document.getElementById('simon-start').textContent = '¡Intentar de nuevo!';
        playTone(150, 0.5, 'sawtooth', 0.2);
    }
}

// ============================================
// ALVARO: BUBBLE POP GAME
// ============================================
let bubbleCount = 0;
let bubbleInterval = null;

const bubbleColors = [
    'rgba(255, 107, 107, 0.7)', 'rgba(78, 205, 196, 0.7)',
    'rgba(255, 230, 109, 0.7)', 'rgba(167, 139, 250, 0.7)',
    'rgba(96, 165, 250, 0.7)', 'rgba(249, 115, 22, 0.7)',
    'rgba(244, 114, 182, 0.7)', 'rgba(52, 211, 153, 0.7)'
];

const bubbleEmojis = ['⭐', '🌟', '💖', '🎈', '🌸', '🦋', '🐣', '🍭'];

function startBubbles() {
    if (bubbleInterval) return;
    bubbleInterval = setInterval(spawnBubble, 800);
    // Spawn a few immediately
    for (let i = 0; i < 3; i++) {
        setTimeout(spawnBubble, i * 200);
    }
}

function spawnBubble() {
    const container = document.getElementById('bubbles-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const size = 50 + Math.random() * 40;
    const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    const emoji = bubbleEmojis[Math.floor(Math.random() * bubbleEmojis.length)];

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.background = color;
    bubble.style.left = `${10 + Math.random() * (rect.width - size - 20)}px`;
    bubble.style.fontSize = `${size * 0.4}px`;
    bubble.textContent = emoji;
    bubble.style.animationDuration = `${3 + Math.random() * 3}s`;

    bubble.addEventListener('click', (e) => {
        e.stopPropagation();
        popBubble(bubble);
    });

    // Touch support for toddler
    bubble.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        popBubble(bubble);
    }, { passive: false });

    container.appendChild(bubble);

    // Auto-remove when animation ends
    setTimeout(() => {
        if (bubble.parentNode) bubble.remove();
    }, 6000);
}

function popBubble(bubble) {
    if (bubble.dataset.popped) return;
    bubble.dataset.popped = 'true';
    bubbleCount++;
    document.getElementById('bubble-count').textContent = bubbleCount;

    // Pop sound - playful high pitch
    playTone(600 + Math.random() * 400, 0.15, 'sine', 0.25);

    bubble.style.animation = 'bubblePop 0.3s ease-out forwards';
    setTimeout(() => bubble.remove(), 300);
}

// Start bubbles when Alvaro section is visible
const alvaroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startBubbles();
        } else {
            if (bubbleInterval) {
                clearInterval(bubbleInterval);
                bubbleInterval = null;
            }
        }
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
        <span style="font-size: 4rem; display: block; animation: bounceIn 0.5s ease;">${emoji}</span>
        <span style="animation: fadeIn 0.3s ease;">${sound}</span>
    `;

    // Simple animal sound using tones
    const animalTones = {
        '🐶': [400, 500],
        '🐱': [600, 700],
        '🐮': [150, 130],
        '🐷': [350, 300, 350],
        '🐸': [250, 350, 250],
        '🦁': [100, 120, 100],
        '🐔': [500, 600, 700, 500],
        '🦆': [400, 350, 400]
    };

    const tones = animalTones[emoji] || [400, 500];
    tones.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.2, 'triangle', 0.25), i * 150);
    });

    // Speech synthesis for the sound text
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(sound);
        utterance.lang = 'es-ES';
        utterance.rate = 0.8;
        utterance.pitch = 1.5;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }
}

// ============================================
// ALVARO: COLORS & SHAPES
// ============================================
function showShape(name, color, symbol, colorName) {
    const display = document.getElementById('shape-display');
    display.style.borderColor = color;
    display.style.boxShadow = `0 0 30px ${color}40`;
    display.innerHTML = `
        <span class="big-shape" style="color: ${color};">${symbol}</span>
        <span class="shape-label" style="color: ${color};">${name} - ${colorName}</span>
    `;

    playTone(300 + Math.random() * 400, 0.25, 'triangle', 0.2);

    // Speech synthesis
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`${name}, color ${colorName}`);
        utterance.lang = 'es-ES';
        utterance.rate = 0.7;
        utterance.pitch = 1.3;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }
}

// ============================================
// BOUNCE ANIMATION (for animal display)
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% { transform: scale(0); }
        50% { transform: scale(1.3); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
