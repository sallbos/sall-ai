/**
 * MR.SALL AI — Code Formatters, Minifiers & Validators
 * Supports HTML, CSS, JavaScript, and JSON
 */

export class CodeFormatters {
  /**
   * JSON Formatter & Line/Col Error Validator
   */
  static formatJson(input, indent = 2) {
    if (!input || !input.trim()) return { success: true, formatted: '', parsed: null };
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      return { success: true, formatted, parsed };
    } catch (err) {
      // Pinpoint line and column from error message or character scan
      let line = 1, col = 1;
      const match = err.message.match(/position\s+(\d+)/i);
      if (match) {
        const pos = parseInt(match[1], 10);
        const lines = input.substring(0, pos).split('\n');
        line = lines.length;
        col = lines[lines.length - 1].length + 1;
      }
      return {
        success: false,
        error: err.message,
        line,
        col,
        formatted: input
      };
    }
  }

  static minifyJson(input) {
    try {
      const parsed = JSON.parse(input);
      return { success: true, minified: JSON.stringify(parsed) };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * HTML Beautifier & Minifier
   */
  static formatHtml(html, indentSize = 2) {
    if (!html) return '';
    let indent = '';
    const tab = ' '.repeat(indentSize);
    let result = '';

    // Normalize spacing
    const tokens = html.replace(/>\s*</g, '><').match(/(<[^>]+>|[^<]+)/g) || [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim();
      if (!token) continue;

      if (token.startsWith('</')) {
        // Closing tag
        indent = indent.slice(0, -tab.length);
        result += `${indent}${token}\n`;
      } else if (token.startsWith('<') && !token.endsWith('/>') && !this.isSelfClosing(token)) {
        // Opening tag
        result += `${indent}${token}\n`;
        indent += tab;
      } else {
        // Content or self-closing
        result += `${indent}${token}\n`;
      }
    }
    return result.trim();
  }

  static isSelfClosing(tag) {
    const voidTags = ['<area', '<base', '<br', '<col', '<embed', '<hr', '<img', '<input', '<link', '<meta', '<param', '<source', '<track', '<wbr'];
    return voidTags.some(vt => tag.toLowerCase().startsWith(vt));
  }

  static minifyHtml(html) {
    return html
      .replace(/<!--[\s\S]*?-->/g, '') // remove comments
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }

  /**
   * CSS Beautifier & Minifier
   */
  static formatCss(css, indentSize = 2) {
    if (!css) return '';
    const tab = ' '.repeat(indentSize);
    let formatted = '';
    let indent = '';

    const clean = css.replace(/\s+/g, ' ').trim();
    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      if (char === '{') {
        formatted += ' {\n';
        indent += tab;
        formatted += indent;
      } else if (char === '}') {
        indent = indent.slice(0, -tab.length);
        formatted += `\n${indent}}\n\n${indent}`;
      } else if (char === ';') {
        formatted += ';\n' + indent;
      } else {
        formatted += char;
      }
    }
    return formatted.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
  }

  static minifyCss(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([\{\}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
  }

  /**
   * JavaScript Beautifier
   */
  static formatJs(js, indentSize = 2) {
    if (!js) return '';
    const tab = ' '.repeat(indentSize);
    let formatted = '';
    let depth = 0;
    const lines = js.split('\n');

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.startsWith('}') || line.startsWith(']')) {
        depth = Math.max(0, depth - 1);
      }

      formatted += tab.repeat(depth) + line + '\n';

      if (line.endsWith('{') || line.endsWith('[')) {
        depth++;
      }
    }
    return formatted.trim();
  }

  static minifyJs(js) {
    return js
      .replace(/\/\/.*$/gm, '') // single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // multi-line comments
      .replace(/\s+/g, ' ')
      .replace(/\s*([=+\-*/%&|!<>?:;,{}()])\s*/g, '$1')
      .trim();
  }
}
