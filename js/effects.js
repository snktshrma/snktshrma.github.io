/**
 * Visual Effects Module
 * ASCII art generator, particle systems, and technical visualizations
 */

// ============================================
// ASCII ART GENERATOR
// ============================================
class ASCIIGenerator {
  constructor() {
    this.chars = ' .:-=+*#%@';
    this.width = 80;
    this.height = 40;
  }

  /**
   * Generate ASCII matrix rain effect
   */
  generateMatrix(container, options = {}) {
    const {
      speed = 50,
      fade = true,
      chars = '01'
    } = options;

    const columns = Math.floor(container.offsetWidth / 10);
    const drops = new Array(columns).fill(1);

    const draw = () => {
      // Semi-transparent black for fade effect
      if (fade) {
        container.style.background = 'rgba(13, 17, 23, 0.05)';
      }

      let output = '';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        output += text;

        if (drops[i] * 10 > container.offsetHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      return output;
    };

    return draw;
  }

  /**
   * Generate ASCII from image data (simplified)
   */
  imageToASCII(imageData, width = 80) {
    const data = imageData.data;
    const height = imageData.height;
    const ascii = [];

    for (let y = 0; y < height; y++) {
      let row = '';
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const charIndex = Math.floor((brightness / 255) * (this.chars.length - 1));
        row += this.chars[charIndex];
      }
      ascii.push(row);
    }

    return ascii.join('\n');
  }

  /**
   * Generate technical pattern ASCII
   */
  generatePattern(type = 'grid', width = 60, height = 20) {
    const patterns = {
      grid: (x, y) => {
        if (x === 0 || x === width - 1) return '│';
        if (y === 0 || y === height - 1) return '─';
        if ((x + y) % 10 === 0) return '┼';
        return ' ';
      },
      circuit: (x, y) => {
        if ((x + y) % 7 === 0) return '┬';
        if (x % 15 === 0 && y % 5 === 0) return '◉';
        if (y % 5 === 0) return '─';
        if (x % 15 === 0) return '│';
        return ' ';
      },
      binary: (x, y) => {
        return Math.random() > 0.5 ? '1' : '0';
      },
      waves: (x, y) => {
        const wave = Math.sin(x / 5 + y / 3) * 3;
        if (Math.abs(wave - y % 6) < 1) return '█';
        return ' ';
      }
    };

    const pattern = patterns[type] || patterns.grid;
    let result = '';

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        result += pattern(x, y);
      }
      result += '\n';
    }

    return result;
  }

  /**
   * Generate code snippet decoration
   */
  generateCodeDecorations() {
    const decorations = [
      '// Initializing system...',
      '// Loading modules...',
      '/* === CONFIG === */',
      '// TODO: Implement feature',
      '/* Core logic */',
      '// Processing data...',
      '/* Output */',
      '// End of section'
    ];

    return decorations[Math.floor(Math.random() * decorations.length)];
  }
}

// ============================================
// PARTICLE SYSTEMS
// ============================================
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.mouseX = 0;
    this.mouseY = 0;
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  createParticle(x, y, type = 'default') {
    const types = {
      default: {
        size: () => Math.random() * 2 + 1,
        speed: () => 0.5,
        alpha: () => Math.random() * 0.5 + 0.2,
        color: () => '88, 166, 255'
      },
      spark: {
        size: () => Math.random() * 3 + 2,
        speed: () => 1.5,
        alpha: () => 0.8,
        color: () => '255, 200, 100'
      },
      data: {
        size: () => Math.random() * 1.5 + 0.5,
        speed: () => 2,
        alpha: () => 0.6,
        color: () => '63, 185, 80'
      }
    };

    const config = types[type] || types.default;

    return {
      x: x || Math.random() * this.canvas.width,
      y: y || Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * config.speed(),
      vy: (Math.random() - 0.5) * config.speed(),
      size: config.size(),
      alpha: config.alpha(),
      color: config.color(),
      life: 1
    };
  }

  init(count = 50, type = 'default') {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(null, null, type));
    }
  }

  update() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.001;

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

      // Respawn dead particles
      if (p.life <= 0) {
        Object.assign(p, this.createParticle(null, null));
        p.life = 1;
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections
    this.ctx.strokeStyle = 'rgba(88, 166, 255, 0.05)';
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

    // Draw particles
    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      this.ctx.fill();
    });
  }

  animate() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    this.resize();
    this.setupEvents();
    this.animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  setupEvents() {
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
    });
  }
}

// ============================================
// GLITCH EFFECT
// ============================================
class GlitchEffect {
  constructor(element) {
    this.element = element;
    this.originalText = element.textContent;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    this.isGlitching = false;
  }

  glitch(duration = 1000) {
    if (this.isGlitching) return;
    this.isGlitching = true;

    let iterations = 0;
    const maxIterations = duration / 50;

    const interval = setInterval(() => {
      this.element.textContent = this.originalText
        .split('')
        .map((char, index) => {
          if (index < iterations) {
            return this.originalText[index];
          }
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        })
        .join('');

      iterations += 1;

      if (iterations >= this.originalText.length) {
        clearInterval(interval);
        this.element.textContent = this.originalText;
        this.isGlitching = false;
      }
    }, 50);
  }
}

// ============================================
// TYPING EFFECT (Advanced)
// ============================================
class TypingEffect {
  constructor(element, options = {}) {
    this.element = element;
    this.text = options.text || '';
    this.speed = options.speed || 50;
    this.delay = options.delay || 1000;
    this.onComplete = options.onComplete || null;
    this.cursor = options.cursor !== false;
    this.cursorChar = options.cursorChar || '▌';
  }

  async type() {
    const text = this.text;
    let i = 0;

    // Add cursor
    if (this.cursor) {
      this.element.innerHTML += `<span class="cursor">${this.cursorChar}</span>`;
    }

    return new Promise(resolve => {
      const typeChar = () => {
        if (i < text.length) {
          if (this.cursor) {
            this.element.innerHTML =
              text.substring(0, i + 1) +
              `<span class="cursor">${this.cursorChar}</span>`;
          } else {
            this.element.textContent = text.substring(0, i + 1);
          }
          i++;
          setTimeout(typeChar, this.speed + Math.random() * 30);
        } else {
          setTimeout(resolve, this.delay);
        }
      };
      typeChar();
    });
  }

  async delete() {
    let i = this.text.length;

    return new Promise(resolve => {
      const deleteChar = () => {
        if (i > 0) {
          i--;
          if (this.cursor) {
            this.element.innerHTML =
              this.text.substring(0, i) +
              `<span class="cursor">${this.cursorChar}</span>`;
          } else {
            this.element.textContent = this.text.substring(0, i);
          }
          setTimeout(deleteChar, this.speed / 2);
        } else {
          resolve();
        }
      };
      deleteChar();
    });
  }
}

// ============================================
// CODE BLOCK ANIMATION
// ============================================
class CodeBlockAnimator {
  constructor(container) {
    this.container = container;
    this.lines = [];
  }

  createLine(content, delay = 0) {
    const line = document.createElement('div');
    line.className = 'code-line';
    line.style.opacity = '0';
    line.style.transform = 'translateX(-10px)';
    line.textContent = content;

    setTimeout(() => {
      line.style.transition = 'all 0.3s ease';
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, delay);

    this.container.appendChild(line);
    this.lines.push(line);
  }

  animateCode(lines) {
    this.container.innerHTML = '';
    lines.forEach((line, index) => {
      this.createLine(line, index * 100);
    });
  }
}

// ============================================
// EXPORT
// ============================================
export {
  ASCIIGenerator,
  ParticleSystem,
  GlitchEffect,
  TypingEffect,
  CodeBlockAnimator
};
