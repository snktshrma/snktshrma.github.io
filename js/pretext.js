/**
 * Pretext Integration Utilities
 * Uses Pretext for text measurement and layout without DOM reads
 * https://github.com/chenglou/pretext
 */

// Pretext library - embedded minimal version for GitHub Pages
// This is a simplified embedding - in production would use @chenglou/pretext package

class PretextEngine {
  constructor() {
    this.cache = new Map();
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.initialized = false;
  }

  /**
   * Initialize Pretext - ensure fonts are loaded
   */
  async init() {
    if (this.initialized) return;

    // Wait for fonts to load
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    this.initialized = true;
  }

  /**
   * Prepare text for measurement (one-time analysis)
   * @param {string} text - Text to measure
   * @param {string} font - CSS font string (e.g., "16px Inter")
   * @param {object} options - Measurement options
   * @returns {object} Prepared text handle
   */
  prepare(text, font, options = {}) {
    const key = `${text}|${font}|${JSON.stringify(options)}`;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    this.ctx.font = font;

    const whiteSpace = options.whiteSpace || 'normal';
    const wordBreak = options.wordBreak || 'normal';

    // Handle whitespace
    let lines;
    if (whiteSpace === 'pre-wrap' || whiteSpace === 'pre') {
      lines = text.split('\n');
    } else {
      // Normalize whitespace for normal mode
      text = text.replace(/\s+/g, ' ').trim();
      lines = [text];
    }

    const result = {
      text,
      font,
      lines,
      options,
      segments: []
    };

    // Measure each line/segment
    for (const line of lines) {
      const width = this.ctx.measureText(line).width;
      result.segments.push({
        text: line,
        width,
        height: this.ctx.measureText('M').width * 1.2 // Approximate height
      });
    }

    this.cache.set(key, result);
    return result;
  }

  /**
   * Calculate layout dimensions (hot path - no DOM reads)
   * @param {object} prepared - Prepared text from prepare()
   * @param {number} maxWidth - Maximum width in pixels
   * @param {number} lineHeight - Line height in pixels
   * @returns {object} { height, lineCount }
   */
  layout(prepared, maxWidth, lineHeight) {
    let totalHeight = 0;
    let lineCount = 0;

    for (const segment of prepared.segments) {
      if (segment.width <= maxWidth) {
        // Fits on one line
        totalHeight += lineHeight;
        lineCount++;
      } else {
        // Need to wrap - estimate word breaks
        const words = segment.text.split(' ');
        let currentLineWidth = 0;
        let currentLineWords = [];

        for (const word of words) {
          const wordWidth = this.ctx.measureText(word + ' ').width;

          if (currentLineWidth + wordWidth <= maxWidth) {
            currentLineWidth += wordWidth;
            currentLineWords.push(word);
          } else {
            if (currentLineWords.length > 0) {
              totalHeight += lineHeight;
              lineCount++;
            }
            currentLineWidth = wordWidth;
            currentLineWords = [word];
          }
        }

        if (currentLineWords.length > 0) {
          totalHeight += lineHeight;
          lineCount++;
        }
      }
    }

    return { height: totalHeight, lineCount };
  }

  /**
   * Get the natural width of text (no wrapping)
   */
  measureWidth(text, font) {
    this.ctx.font = font;
    return this.ctx.measureText(text).width;
  }

  /**
   * Get text height for a given font
   */
  measureHeight(font) {
    this.ctx.font = font;
    const metrics = this.ctx.measureText('M');
    return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  }

  /**
   * Clear the measurement cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Global instance
const pretext = new PretextEngine();

/**
 * Utility: Calculate card height for masonry layout
 */
function calculateCardHeight(content, config) {
  const {
    title,
    description,
    techStack,
    padding = 20,
    gap = 16,
    titleSize = '18px',
    descSize = '14px',
    techSize = '12px',
    lineHeight = 1.5,
    maxWidth
  } = config;

  let height = padding * 2;

  // Title height
  const titleMetrics = pretext.prepare(title, `600 ${titleSize} var(--font-sans)`);
  const titleLayout = pretext.layout(titleMetrics, maxWidth, 24);
  height += titleLayout.height;

  // Gap
  height += gap;

  // Description height
  const descMetrics = pretext.prepare(description, `${descSize} var(--font-sans)`);
  const descLayout = pretext.layout(descMetrics, maxWidth, 22);
  height += descLayout.height;

  // Gap
  height += gap;

  // Tech stack height (single line assumed)
  height += 24;

  return height;
}

/**
 * Utility: Create masonry layout
 */
function createMasonry(items, container, renderItem) {
  const columns = [[], []];

  items.forEach((item, index) => {
    // Add to shorter column
    const col1Height = columns[0].reduce((sum, i) => sum + i.height, 0);
    const col2Height = columns[1].reduce((sum, i) => sum + i.height, 0);

    if (col1Height <= col2Height) {
      columns[0].push(item);
    } else {
      columns[1].push(item);
    }
  });

  return columns;
}

export { pretext, calculateCardHeight, createMasonry };
