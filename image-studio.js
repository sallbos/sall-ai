/**
 * MR.SALL AI — Image Studio Workspace
 * Client-Side Canvas Manipulation, Enhancements, Before/After Slider, and Format Converter
 */

import { i18n } from '../services/i18n.js';
import { imageStudio } from '../tools/image-processor.js';
import { toast } from '../components/toast.js';
import { storage } from '../services/storage.js';

export class ImageStudioPage {
  constructor() {
    this.hasImage = false;
    this.originalDataUrl = null;
    this.aspectRatioLocked = true;
  }

  render(container) {
    container.innerHTML = `
      <div class="page-inner">
        <div class="page-header-block">
          <h1 class="page-main-title" data-i18n="imageStudio.title">Image Studio</h1>
          <p class="page-main-subtitle" data-i18n="imageStudio.subtitle">
            Professional client-side and cloud image processing, enhancement, and format conversion.
          </p>
        </div>

        <!-- Upload Drop Zone (Visible when no image loaded) -->
        <div id="image-upload-dropzone" class="apple-card" style="border:2px dashed var(--apple-border-strong); padding:48px 24px; text-align:center; cursor:pointer; margin-bottom:24px; transition:border-color var(--transition-fast);">
          <input type="file" id="image-file-input" accept="image/*" style="display:none;" />
          <div style="width:64px; height:64px; border-radius:20px; background:var(--apple-blue-light); color:var(--apple-blue); display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <h3 style="font-size:18px; font-weight:700; margin-bottom:6px;" data-i18n="imageStudio.uploadPrompt">
            Drop your image here or browse files
          </h3>
          <p style="font-size:13.5px; color:var(--apple-text-secondary);" data-i18n="imageStudio.uploadSub">
            Supports PNG, JPEG, WEBP, SVG, and GIF up to 25MB
          </p>
        </div>

        <!-- Studio Workspace (Visible after image loaded) -->
        <div id="image-workspace" style="display:none; gap:24px;" class="grid-split-2">
          <!-- Left: Canvas Viewport & Before/After Slider -->
          <div class="apple-card" style="display:flex; flex-direction:column; gap:16px; align-items:center;">
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
              <span style="font-weight:700; font-size:14px;" data-i18n="imageStudio.beforeAfter">Before / After Comparison</span>
              <button id="btn-image-change" class="btn-ghost" style="font-size:12px;">Change Image</button>
            </div>

            <!-- Interactive Split Comparison Viewport -->
            <div id="split-compare-container" style="position:relative; width:100%; max-height:480px; overflow:hidden; border-radius:12px; background:#111; display:flex; align-items:center; justify-content:center; user-select:none;">
              <img id="img-original-preview" src="" alt="Original" style="max-width:100%; max-height:480px; object-fit:contain; display:block;" />
              <div id="split-processed-wrapper" style="position:absolute; top:0; left:0; right:0; bottom:0; overflow:hidden; width:50%;">
                <canvas id="studio-canvas" style="max-width:100%; max-height:480px; object-fit:contain;"></canvas>
              </div>
              <!-- Draggable Divider Line -->
              <div id="split-handle" style="position:absolute; top:0; bottom:0; left:50%; width:3px; background:#ffffff; box-shadow:0 0 10px rgba(0,0,0,0.5); cursor:ew-resize; display:flex; align-items:center; justify-content:center;">
                <div style="width:24px; height:24px; border-radius:50%; background:#ffffff; color:#000; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; box-shadow:0 2px 6px rgba(0,0,0,0.3);">⬌</div>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; width:100%; font-size:12px; color:var(--apple-text-secondary);">
              <span>◀ Original</span>
              <span id="label-image-dims">0 × 0 px</span>
              <span>Processed ▶</span>
            </div>
          </div>

          <!-- Right: Control Panel (Enhancements, Sizing, Export) -->
          <div class="apple-card" style="display:flex; flex-direction:column; gap:20px;">
            <div>
              <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;" data-i18n="imageStudio.enhancements">Enhancements</h3>
              
              <div style="display:flex; flex-direction:column; gap:12px;">
                <!-- Brightness -->
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:600; margin-bottom:4px;">
                    <span data-i18n="imageStudio.brightness">Brightness</span>
                    <span id="val-brightness">100%</span>
                  </div>
                  <input type="range" id="range-brightness" min="0" max="200" value="100" style="width:100%;" />
                </div>

                <!-- Contrast -->
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:600; margin-bottom:4px;">
                    <span data-i18n="imageStudio.contrast">Contrast</span>
                    <span id="val-contrast">100%</span>
                  </div>
                  <input type="range" id="range-contrast" min="0" max="200" value="100" style="width:100%;" />
                </div>

                <!-- Saturation -->
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:600; margin-bottom:4px;">
                    <span data-i18n="imageStudio.saturation">Saturation</span>
                    <span id="val-saturation">100%</span>
                  </div>
                  <input type="range" id="range-saturation" min="0" max="200" value="100" style="width:100%;" />
                </div>

                <!-- Sharpness -->
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:600; margin-bottom:4px;">
                    <span data-i18n="imageStudio.sharpness">Sharpness</span>
                    <span id="val-sharpness">0</span>
                  </div>
                  <input type="range" id="range-sharpness" min="0" max="10" value="0" style="width:100%;" />
                </div>

                <!-- One-click Filters -->
                <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:4px;">
                  <button id="btn-filter-grayscale" class="btn-secondary" style="padding:6px 12px; font-size:12px;">Grayscale</button>
                  <button id="btn-filter-sepia" class="btn-secondary" style="padding:6px 12px; font-size:12px;">Sepia</button>
                  <button id="btn-filter-invert" class="btn-secondary" style="padding:6px 12px; font-size:12px;">Invert</button>
                  <button id="btn-filter-reset" class="btn-ghost" style="padding:6px 12px; font-size:12px; color:var(--apple-red);">Reset</button>
                </div>
              </div>
            </div>

            <!-- AI Operations -->
            <div style="border-top:1px solid var(--apple-border); padding-top:16px;">
              <h4 style="font-size:14px; font-weight:700; margin-bottom:10px;">Smart Neural Tools</h4>
              <div style="display:flex; gap:10px;">
                <button id="btn-op-upscale" class="btn-secondary" style="flex:1; font-size:12.5px;">
                  ✨ AI Upscale 2x
                </button>
                <button id="btn-op-removebg" class="btn-secondary" style="flex:1; font-size:12.5px;">
                  ✂️ Remove BG
                </button>
              </div>
            </div>

            <!-- Resize & Export -->
            <div style="border-top:1px solid var(--apple-border); padding-top:16px;">
              <h4 style="font-size:14px; font-weight:700; margin-bottom:10px;">Dimensions & Format</h4>
              
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
                <div>
                  <label style="font-size:11.5px; font-weight:600; display:block; margin-bottom:4px;">Width (px)</label>
                  <input type="number" id="input-dim-w" style="width:100%;" />
                </div>
                <div>
                  <label style="font-size:11.5px; font-weight:600; display:block; margin-bottom:4px;">Height (px)</label>
                  <input type="number" id="input-dim-h" style="width:100%;" />
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
                <div>
                  <label style="font-size:11.5px; font-weight:600; display:block; margin-bottom:4px;">Format</label>
                  <select id="select-export-format" style="width:100%;">
                    <option value="image/png">PNG (Lossless)</option>
                    <option value="image/jpeg">JPEG (Compressed)</option>
                    <option value="image/webp">WEBP (Modern Web)</option>
                  </select>
                </div>
                <div>
                  <label style="font-size:11.5px; font-weight:600; display:block; margin-bottom:4px;">Quality</label>
                  <input type="range" id="range-export-quality" min="10" max="100" value="92" style="width:100%;" />
                </div>
              </div>

              <button id="btn-download-image" class="btn-primary" style="width:100%; padding:12px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Processed Image
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    const dropzone = container.querySelector('#image-upload-dropzone');
    const fileInput = container.querySelector('#image-file-input');
    const workspace = container.querySelector('#image-workspace');
    const changeBtn = container.querySelector('#btn-image-change');

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--apple-blue)';
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'var(--apple-border-strong)';
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--apple-border-strong)';
      if (e.dataTransfer.files[0]) this.handleFile(e.dataTransfer.files[0], container);
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files[0]) this.handleFile(e.target.files[0], container);
    });

    changeBtn.addEventListener('click', () => {
      workspace.style.display = 'none';
      dropzone.style.display = 'block';
    });

    // Enhancement Sliders
    const bindSlider = (id, filterName, valLabelId, suffix = '%') => {
      const slider = container.querySelector(`#${id}`);
      const label = container.querySelector(`#${valLabelId}`);
      slider.addEventListener('input', (e) => {
        label.textContent = e.target.value + suffix;
        imageStudio.setFilter(filterName, e.target.value);
        this.updateCanvasDisplay(container);
      });
    };

    bindSlider('range-brightness', 'brightness', 'val-brightness', '%');
    bindSlider('range-contrast', 'contrast', 'val-contrast', '%');
    bindSlider('range-saturation', 'saturation', 'val-saturation', '%');
    bindSlider('range-sharpness', 'sharpness', 'val-sharpness', '');

    // Preset buttons
    container.querySelector('#btn-filter-grayscale').addEventListener('click', () => {
      imageStudio.setFilter('grayscale', 100);
      this.updateCanvasDisplay(container);
    });
    container.querySelector('#btn-filter-sepia').addEventListener('click', () => {
      imageStudio.setFilter('sepia', 100);
      this.updateCanvasDisplay(container);
    });
    container.querySelector('#btn-filter-invert').addEventListener('click', () => {
      imageStudio.setFilter('invert', 100);
      this.updateCanvasDisplay(container);
    });
    container.querySelector('#btn-filter-reset').addEventListener('click', () => {
      imageStudio.resetFilters();
      container.querySelector('#range-brightness').value = 100;
      container.querySelector('#val-brightness').textContent = '100%';
      container.querySelector('#range-contrast').value = 100;
      container.querySelector('#val-contrast').textContent = '100%';
      container.querySelector('#range-saturation').value = 100;
      container.querySelector('#val-saturation').textContent = '100%';
      container.querySelector('#range-sharpness').value = 0;
      container.querySelector('#val-sharpness').textContent = '0';
      imageStudio.render();
      this.updateCanvasDisplay(container);
    });

    // AI Tools
    container.querySelector('#btn-op-upscale').addEventListener('click', () => {
      imageStudio.upscale(2);
      this.syncDimensions(container);
      this.updateCanvasDisplay(container);
      toast.success('Image upscaled 2x with edge sharpening!');
    });

    container.querySelector('#btn-op-removebg').addEventListener('click', () => {
      imageStudio.removeBackground(35);
      this.updateCanvasDisplay(container);
      toast.success('Background removal filter applied.');
    });

    // Split View Slider Dragging
    const splitContainer = container.querySelector('#split-compare-container');
    const splitWrapper = container.querySelector('#split-processed-wrapper');
    const splitHandle = container.querySelector('#split-handle');
    let isDragging = false;

    const onMove = (clientX) => {
      if (!isDragging) return;
      const rect = splitContainer.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const pct = (x / rect.width) * 100;
      splitWrapper.style.width = `${pct}%`;
      splitHandle.style.left = `${pct}%`;
    };

    splitHandle.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => onMove(e.clientX));

    // Touch events for mobile
    splitHandle.addEventListener('touchstart', () => { isDragging = true; });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) onMove(e.touches[0].clientX);
    });

    // Download
    container.querySelector('#btn-download-image').addEventListener('click', () => {
      const format = container.querySelector('#select-export-format').value;
      const quality = Number(container.querySelector('#range-export-quality').value) / 100;
      imageStudio.exportFormat = format;
      imageStudio.exportQuality = quality;
      imageStudio.download('mrsall-enhanced');
      storage.incrementUsage('images');
      toast.success('Image downloaded successfully!');
    });
  }

  async handleFile(file, container) {
    try {
      const meta = await imageStudio.loadImage(file);
      this.hasImage = true;
      this.originalDataUrl = URL.createObjectURL(file);

      container.querySelector('#image-upload-dropzone').style.display = 'none';
      container.querySelector('#image-workspace').style.display = 'grid';

      container.querySelector('#img-original-preview').src = this.originalDataUrl;
      this.syncDimensions(container);
      this.updateCanvasDisplay(container);
      toast.success('Image loaded into Studio.');
    } catch (e) {
      toast.error('Failed to parse image file: ' + e.message);
    }
  }

  syncDimensions(container) {
    const c = imageStudio.getCanvas();
    container.querySelector('#input-dim-w').value = c.width;
    container.querySelector('#input-dim-h').value = c.height;
    container.querySelector('#label-image-dims').textContent = `${c.width} × ${c.height} px`;
  }

  updateCanvasDisplay(container) {
    const canvas = container.querySelector('#studio-canvas');
    if (!canvas) return;
    const sourceCanvas = imageStudio.getCanvas();
    canvas.width = sourceCanvas.width;
    canvas.height = sourceCanvas.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(sourceCanvas, 0, 0);
  }
}

export const imageStudioPage = new ImageStudioPage();
