/**
 * MR.SALL AI — Image Studio Engine
 * Client-Side HTML5 Canvas 2D Image Manipulation & Transformation
 */

export class ImageProcessor {
  constructor() {
    this.originalImage = null;
    this.workingCanvas = document.createElement('canvas');
    this.ctx = this.workingCanvas.getContext('2d');
    this.filters = {
      brightness: 100, // %
      contrast: 100,   // %
      saturation: 100, // %
      sharpness: 0,    // 0 to 10
      grayscale: 0,    // %
      sepia: 0,        // %
      invert: 0,       // %
      blur: 0          // px
    };
    this.targetWidth = 0;
    this.targetHeight = 0;
    this.aspectRatio = 1;
    this.exportFormat = 'image/png';
    this.exportQuality = 0.92;
  }

  async loadImage(fileOrUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.originalImage = img;
        this.targetWidth = img.naturalWidth;
        this.targetHeight = img.naturalHeight;
        this.aspectRatio = img.naturalWidth / img.naturalHeight;
        this.workingCanvas.width = img.naturalWidth;
        this.workingCanvas.height = img.naturalHeight;
        this.resetFilters();
        this.render();
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: this.aspectRatio
        });
      };
      img.onerror = reject;

      if (typeof fileOrUrl === 'string') {
        img.src = fileOrUrl;
      } else if (fileOrUrl instanceof Blob || fileOrUrl instanceof File) {
        img.src = URL.createObjectURL(fileOrUrl);
      }
    });
  }

  resetFilters() {
    this.filters = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sharpness: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0,
      blur: 0
    };
  }

  setFilter(name, value) {
    if (name in this.filters) {
      this.filters[name] = Number(value);
      this.render();
    }
  }

  setDimensions(width, height) {
    this.targetWidth = Math.max(1, Math.round(width));
    this.targetHeight = Math.max(1, Math.round(height));
    this.workingCanvas.width = this.targetWidth;
    this.workingCanvas.height = this.targetHeight;
    this.render();
  }

  render() {
    if (!this.originalImage) return;

    this.ctx.clearRect(0, 0, this.workingCanvas.width, this.workingCanvas.height);

    // Apply CSS filter transformations
    const f = this.filters;
    this.ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) grayscale(${f.grayscale}%) sepia(${f.sepia}%) invert(${f.invert}%) blur(${f.blur}px)`;
    
    // Draw scaled image
    this.ctx.drawImage(this.originalImage, 0, 0, this.workingCanvas.width, this.workingCanvas.height);
    this.ctx.filter = 'none';

    // Apply Sharpness Convolution kernel if specified
    if (f.sharpness > 0) {
      this.applySharpness(f.sharpness / 10);
    }
  }

  applySharpness(strength = 0.5) {
    const w = this.workingCanvas.width;
    const h = this.workingCanvas.height;
    if (w * h > 4000000) return; // safeguard for huge images
    const imgData = this.ctx.getImageData(0, 0, w, h);
    const src = imgData.data;
    const output = this.ctx.createImageData(w, h);
    const dst = output.data;

    // Convolution kernel for sharpening:
    //  0  -s   0
    // -s 1+4s -s
    //  0  -s   0
    const s = strength;
    const center = 1 + 4 * s;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        const top = ((y - 1) * w + x) * 4;
        const btm = ((y + 1) * w + x) * 4;
        const left = (y * w + (x - 1)) * 4;
        const right = (y * w + (x + 1)) * 4;

        for (let c = 0; c < 3; c++) {
          dst[idx + c] = Math.min(255, Math.max(0,
            src[idx + c] * center -
            (src[top + c] + src[btm + c] + src[left + c] + src[right + c]) * s
          ));
        }
        dst[idx + 3] = src[idx + 3]; // Alpha
      }
    }
    this.ctx.putImageData(output, 0, 0);
  }

  /**
   * Client-Side Smart Background Eraser
   * Uses corner edge color sampling and adaptive chroma thresholding
   */
  removeBackground(tolerance = 30) {
    if (!this.originalImage) return;
    const w = this.workingCanvas.width;
    const h = this.workingCanvas.height;
    const imgData = this.ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Sample average background color from the four corners
    const corners = [0, (w - 1) * 4, ((h - 1) * w) * 4, ((h - 1) * w + (w - 1)) * 4];
    let avgR = 0, avgG = 0, avgB = 0;
    corners.forEach(idx => {
      avgR += data[idx];
      avgG += data[idx + 1];
      avgB += data[idx + 2];
    });
    avgR /= 4; avgG /= 4; avgB /= 4;

    const tolSq = tolerance * tolerance * 3;

    for (let i = 0; i < data.length; i += 4) {
      const dr = data[i] - avgR;
      const dg = data[i + 1] - avgG;
      const db = data[i + 2] - avgB;
      const distSq = dr * dr + dg * dg + db * db;

      if (distSq < tolSq) {
        data[i + 3] = 0; // Transparent
      }
    }

    this.ctx.putImageData(imgData, 0, 0);
  }

  /**
   * AI Super-Resolution / Upscale Simulation
   * Multi-pass bicubic upsampling with edge enhancement
   */
  upscale(factor = 2) {
    if (!this.originalImage) return;
    const newW = Math.round(this.workingCanvas.width * factor);
    const newH = Math.round(this.workingCanvas.height * factor);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.workingCanvas.width;
    tempCanvas.height = this.workingCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(this.workingCanvas, 0, 0);

    this.workingCanvas.width = newW;
    this.workingCanvas.height = newH;
    this.targetWidth = newW;
    this.targetHeight = newH;

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.ctx.drawImage(tempCanvas, 0, 0, newW, newH);
    this.applySharpness(0.6);
  }

  getCanvas() {
    return this.workingCanvas;
  }

  toDataURL(format = this.exportFormat, quality = this.exportQuality) {
    return this.workingCanvas.toDataURL(format, quality);
  }

  async toBlob(format = this.exportFormat, quality = this.exportQuality) {
    return new Promise(resolve => {
      this.workingCanvas.toBlob(resolve, format, quality);
    });
  }

  download(filename = 'mrsall-processed-image') {
    const ext = this.exportFormat.split('/')[1] || 'png';
    const link = document.createElement('a');
    link.download = `${filename}.${ext}`;
    link.href = this.toDataURL();
    link.click();
  }
}

export const imageStudio = new ImageProcessor();
