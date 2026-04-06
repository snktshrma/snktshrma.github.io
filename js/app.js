/**
 * Portfolio Application
 * Technical/Geeky Design - 2026
 */

import { pretext } from './pretext.js';
import { ASCIIGenerator, ParticleSystem, GlitchEffect, TypingEffect } from './effects.js';

// ============================================
// APPLICATION STATE
// ============================================
const App = {
  state: {
    currentSection: 'home',
    mobileMenuOpen: false,
    activeExpTab: 0,
    typedTextIndex: 0,
    isTyping: false
  },

  // ============================================
  // INITIALIZATION
  // ============================================
  async init() {
    console.log('[PORTFOLIO] Initializing...');

    // Initialize Pretext
    await pretext.init();
    console.log('[PORTFOLIO] Pretext initialized');

    // Setup components
    this.setupNavigation();
    this.setupTypewriter();
    this.setupExperienceTabs();
    this.setupScrollEffects();
    this.setupMobileMenu();
    this.setupASCIIBackground();
    this.setupMasonryGrid();

    console.log('[PORTFOLIO] Ready');
  },

  // ============================================
  // NAVIGATION
  // ============================================
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('section[id]');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        const target = document.getElementById(targetId);

        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Update active states
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // Update active nav on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('active', link.dataset.target === id);
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    sections.forEach(section => observer.observe(section));
  },

  // ============================================
  // TYPEWRITER EFFECT
  // ============================================
  setupTypewriter() {
    const lines = [
      { prompt: '$', command: 'whoami', output: 'sanket_sharma' },
      { prompt: '$', command: 'cat role.txt', output: 'Mechatronics Engineer | Robotics Developer | Control Systems Specialist' },
      { prompt: '$', command: 'cat location.txt', output: 'India' },
      { prompt: '$', command: 'cat interests.txt', output: 'Control Theory, RL, Computer Vision, Embedded Systems' },
      { prompt: '$', command: 'cat status.txt', output: 'Open to interesting opportunities' },
      { prompt: '$', command: '_', output: '', isCursor: true }
    ];

    const container = document.querySelector('.terminal-lines');
    if (!container) return;

    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = '';
    let isOutput = false;

    const typeNext = () => {
      if (lineIndex >= lines.length) {
        // Restart after delay
        setTimeout(() => {
          container.innerHTML = '';
          lineIndex = 0;
          charIndex = 0;
          currentLine = '';
          isOutput = false;
          typeNext();
        }, 5000);
        return;
      }

      const line = lines[lineIndex];

      if (line.isCursor) {
        // Add cursor line
        const cursorEl = document.createElement('div');
        cursorEl.className = 'terminal-line';
        cursorEl.innerHTML = `
          <span class="terminal-prompt">${line.prompt}</span>
          <span class="terminal-command"><span class="cursor-blink">▌</span></span>
        `;
        container.appendChild(cursorEl);
        lineIndex++;
        setTimeout(typeNext, 100);
        return;
      }

      if (!isOutput) {
        // Typing command
        if (charIndex < line.command.length) {
          currentLine += line.command[charIndex];
          charIndex++;

          // Update or create line element
          let lineEl = container.querySelector('.terminal-line:last-child');
          if (!lineEl || !lineEl.classList.contains('terminal-command-line')) {
            lineEl = document.createElement('div');
            lineEl.className = 'terminal-line terminal-command-line';
            container.appendChild(lineEl);
          }
          lineEl.innerHTML = `
            <span class="terminal-prompt">${line.prompt}</span>
            <span class="terminal-command">${currentLine}<span class="cursor-blink">▌</span></span>
          `;

          setTimeout(typeNext, 50 + Math.random() * 50);
        } else {
          // Command complete, show output next
          isOutput = true;
          charIndex = 0;
          setTimeout(typeNext, 300);
        }
      } else {
        // Show output
        if (line.output) {
          const outputEl = document.createElement('div');
          outputEl.className = 'terminal-output';
          outputEl.textContent = line.output;
          container.appendChild(outputEl);
        }

        lineIndex++;
        charIndex = 0;
        currentLine = '';
        isOutput = false;
        setTimeout(typeNext, 200);
      }
    };

    // Start typing after a short delay
    setTimeout(typeNext, 500);
  },

  // ============================================
  // EXPERIENCE TABS
  // ============================================
  setupExperienceTabs() {
    const tabs = document.querySelectorAll('.exp-tab');
    const contents = document.querySelectorAll('.exp-content');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        if (contents[index]) {
          contents[index].classList.add('active');
        }

        this.state.activeExpTab = index;
      });
    });
  },

  // ============================================
  // SCROLL EFFECTS
  // ============================================
  setupScrollEffects() {
    // Progress bar
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
      });
    }

    // Fade in sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-section').forEach(section => {
      observer.observe(section);
    });
  },

  // ============================================
  // MOBILE MENU
  // ============================================
  setupMobileMenu() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    const navTabs = document.querySelector('.nav-tabs');

    if (toggle && navTabs) {
      toggle.addEventListener('click', () => {
        this.state.mobileMenuOpen = !this.state.mobileMenuOpen;
        navTabs.classList.toggle('active', this.state.mobileMenuOpen);
      });
    }
  },

  // ============================================
  // ASCII BACKGROUND
  // ============================================
  setupASCIIBackground() {
    const container = document.querySelector('.hero-bg');
    if (!container) return;

    const asciiGen = new ASCIIGenerator();

    // Generate binary pattern background
    const pattern = asciiGen.generatePattern('binary', 80, 30);

    // Split into lines and render
    const lines = pattern.split('\n');
    let html = '<div style="font-size: 10px; line-height: 1.2; opacity: 0.3;">';
    lines.forEach(line => {
      if (line) {
        html += `<div>${line}</div>`;
      }
    });
    html += '</div>';

    container.innerHTML = html;

    // Subtle animation - update random characters
    setInterval(() => {
      const divs = container.querySelectorAll('div');
      if (divs.length > 0) {
        const randomDiv = divs[Math.floor(Math.random() * divs.length)];
        const text = randomDiv.textContent;
        if (text.length > 0) {
          const pos = Math.floor(Math.random() * text.length);
          const newText = text.substring(0, pos) +
            (Math.random() > 0.5 ? '1' : '0') +
            text.substring(pos + 1);
          randomDiv.textContent = newText;
        }
      }
    }, 100);
  },

  // ============================================
  // MASONRY GRID (Pretext-powered)
  // ============================================
  setupMasonryGrid() {
    const grid = document.querySelector('.projects-masonry');
    if (!grid) return;

    const cards = grid.querySelectorAll('.project-card');

    // Use Pretext to calculate heights for consistent cards
    // Heights are calculated at runtime based on content
    cards.forEach(card => {
      // Card heights are managed by CSS grid
      // Pretext integration available for dynamic layouts
    });
  }
};

// ============================================
// PARTICLE ANIMATION (Canvas-based)
// ============================================
class ParticleField {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;

    this.resize();
    this.init();
    this.setupEvents();
    this.animate();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  init() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  setupEvents() {
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Mouse interaction
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        p.vx -= dx * 0.0001;
        p.vy -= dy * 0.0001;
      }

      // Wrap around
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Draw
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(88, 166, 255, ${p.alpha})`;
      this.ctx.fill();
    });

    // Draw connections
    this.ctx.strokeStyle = 'rgba(88, 166, 255, 0.1)';
    this.ctx.lineWidth = 0.5;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// BOOT SEQUENCE
// ============================================
const bootMessages = [
  '[OK] Loading kernel modules...',
  '[OK] Initializing memory manager...',
  '[OK] Mounting filesystems...',
  '[OK] Starting network services...',
  '[OK] Loading user preferences...',
  '[OK] Initializing graphics subsystem...',
  '[OK] Loading portfolio modules...',
  '[OK] Starting particle engine...',
  '[OK] Preparing ASCII backgrounds...',
  '[OK] Warming up syntax highlighter...',
  '[OK] Loading experience data...',
  '[OK] Compiling project list...',
  '[OK] Starting animation engine...',
  '[OK] System ready.',
  '[SUCCESS] Portfolio loaded successfully!'
];

async function runBootSequence() {
  const bootLog = document.getElementById('boot-log');
  const bootLoader = document.getElementById('boot-loader');

  if (!bootLog || !bootLoader) return;

  // Clear initial content
  bootLog.innerHTML = '';

  for (const message of bootMessages) {
    const line = document.createElement('div');
    line.className = 'boot-line';

    // Color code based on message type
    if (message.includes('[OK]')) {
      line.innerHTML = `<span class="text-success">[OK]</span> ${message.replace('[OK] ', '')}`;
    } else if (message.includes('[SUCCESS]')) {
      line.innerHTML = `<span class="text-success">${message}</span>`;
    } else if (message.includes('[ERROR]')) {
      line.innerHTML = `<span class="text-error">${message}</span>`;
    } else if (message.includes('[WARN]')) {
      line.innerHTML = `<span class="text-warning">${message}</span>`;
    } else {
      line.textContent = message;
    }

    bootLog.appendChild(line);
    bootLog.scrollTop = bootLog.scrollHeight;

    // Random delay for realism
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
  }

  // Fade out boot loader
  await new Promise(resolve => setTimeout(resolve, 500));
  bootLoader.style.transition = 'opacity 0.5s ease';
  bootLoader.style.opacity = '0';

  await new Promise(resolve => setTimeout(resolve, 500));
  bootLoader.style.display = 'none';
}

// ============================================
// COMMAND PALETTE
// ============================================
let commandPaletteOpen = false;

function toggleCommandPalette() {
  const palette = document.getElementById('command-palette');
  const input = document.getElementById('command-input');

  if (commandPaletteOpen) {
    palette.style.display = 'none';
    commandPaletteOpen = false;
  } else {
    palette.style.display = 'flex';
    input.focus();
    commandPaletteOpen = true;
  }
}

function executeCommand(action) {
  const actions = {
    home: () => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }),
    about: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }),
    experience: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }),
    projects: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }),
    publications: () => document.getElementById('publications')?.scrollIntoView({ behavior: 'smooth' }),
    contact: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
    theme: () => document.body.classList.toggle('light-theme')
  };

  if (actions[action]) {
    actions[action]();
    toggleCommandPalette();
  }
}

function setupCommandPalette() {
  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleCommandPalette();
    }
    if (e.key === 'Escape' && commandPaletteOpen) {
      toggleCommandPalette();
    }
  });

  // Command items click
  document.querySelectorAll('.command-item').forEach(item => {
    item.addEventListener('click', () => {
      executeCommand(item.dataset.action);
    });
  });

  // Number shortcuts
  document.addEventListener('keydown', (e) => {
    if (commandPaletteOpen) return;

    const sectionMap = {
      '1': 'home',
      '2': 'about',
      '3': 'experience',
      '4': 'projects',
      '5': 'publications',
      '6': 'contact'
    };

    if (sectionMap[e.key]) {
      executeCommand(sectionMap[e.key]);
    }
  });
}


// ============================================
// START APPLICATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Run boot sequence first
  runBootSequence();

  // Initialize app
  App.init();

  // Setup command palette
  setupCommandPalette();

  // Initialize particle field if element exists
  if (document.getElementById('particle-canvas')) {
    new ParticleField('particle-canvas');
  }

  // Animate stats
  animateStats();
});

// ============================================
// EXPORT FOR EXTERNAL USE
// ============================================
export { App, ParticleField, toggleCommandPalette };
