/**
 * MR.SALL AI — AI Writing Studio
 * 9 Specialized Intelligent Writing Engines
 */

import { i18n } from '../services/i18n.js';
import { api } from '../services/api.js';
import { storage } from '../services/storage.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

export class WritingStudioPage {
  constructor() {
    this.activeTool = 'article';
    this.isGenerating = false;
  }

  render(container) {
    container.innerHTML = `
      <div class="page-inner">
        <div class="page-header-block">
          <h1 class="page-main-title" data-i18n="writing.title">AI Writing Studio</h1>
          <p class="page-main-subtitle" data-i18n="writing.subtitle">
            Nine specialized intelligent writing engines engineered for professionals, academics, and creators.
          </p>
        </div>

        <!-- Tool Selection Tabs -->
        <div class="writing-tabs-bar" style="display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; margin-bottom:20px; border-bottom:1px solid var(--apple-border);">
          <button class="btn-ghost writing-tab-btn active-tab" data-tool="article">📰 Article Writer</button>
          <button class="btn-ghost writing-tab-btn" data-tool="essay">🎓 Essay Writer</button>
          <button class="btn-ghost writing-tab-btn" data-tool="email">✉️ Email Writer</button>
          <button class="btn-ghost writing-tab-btn" data-tool="social">📱 Social Media</button>
          <button class="btn-ghost writing-tab-btn" data-tool="prompt">⚡ Prompt Generator</button>
          <button class="btn-ghost writing-tab-btn" data-tool="summarizer">📄 Text Summarizer</button>
          <button class="btn-ghost writing-tab-btn" data-tool="grammar">🔍 Grammar Check</button>
          <button class="btn-ghost writing-tab-btn" data-tool="rewriter">🔄 Text Rewriter</button>
          <button class="btn-ghost writing-tab-btn" data-tool="ideas">💡 Content Ideas</button>
        </div>

        <!-- Tool Workspace Grid -->
        <div class="grid-split-2" style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
          <!-- Left: Input Form Panel -->
          <div class="apple-card" style="display:flex; flex-direction:column; gap:16px;">
            <div id="writing-form-fields" style="display:flex; flex-direction:column; gap:14px;">
              <!-- Dynamic form controls injected here -->
            </div>

            <button id="btn-writing-generate" class="btn-primary" style="padding:12px; margin-top:8px;">
              <span id="writing-btn-text">Generate with AI</span>
            </button>
          </div>

          <!-- Right: Output & Statistics Panel -->
          <div class="apple-card" style="display:flex; flex-direction:column; gap:14px; position:relative;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; font-size:14px;">Generated Output</span>
              <div style="display:flex; gap:6px;">
                <button id="btn-writing-copy" class="btn-ghost" style="font-size:12px; padding:4px 8px;">Copy</button>
                <button id="btn-writing-fav" class="btn-ghost" style="font-size:12px; padding:4px 8px;">★ Save</button>
                <button id="btn-writing-download" class="btn-ghost" style="font-size:12px; padding:4px 8px;">Download</button>
              </div>
            </div>

            <div id="writing-output-area" style="flex:1; min-height:360px; max-height:560px; overflow-y:auto; padding:16px; background:var(--apple-surface-secondary); border-radius:12px; font-size:14.5px; line-height:1.6; white-space:pre-wrap; border:1px solid var(--apple-border);">
              <span style="color:var(--apple-text-tertiary); font-style:italic;">Your AI generated content will appear here...</span>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--apple-text-secondary); border-top:1px solid var(--apple-border); padding-top:10px;">
              <span><strong id="stat-words">0</strong> Words</span>
              <span><strong id="stat-chars">0</strong> Characters</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.renderFormForTool(this.activeTool, container);
  }

  renderFormForTool(tool, container) {
    const fieldsContainer = container.querySelector('#writing-form-fields');
    if (!fieldsContainer) return;

    switch (tool) {
      case 'article':
        fieldsContainer.innerHTML = `
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Article Topic</label>
            <input type="text" id="w-topic" placeholder="e.g. Next-Generation Autonomous AI Systems in 2026" style="width:100%;" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Tone</label>
              <select id="w-tone" style="width:100%;">
                <option value="Professional & Analytical">Professional & Analytical</option>
                <option value="Engaging & Thought-Provoking">Engaging & Thought-Provoking</option>
                <option value="Casual & Conversational">Casual & Conversational</option>
                <option value="Authoritative Executive">Authoritative Executive</option>
              </select>
            </div>
            <div>
              <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Length</label>
              <select id="w-length" style="width:100%;">
                <option value="Short (~400 words)">Short (~400 words)</option>
                <option value="Standard (~800 words)" selected>Standard (~800 words)</option>
                <option value="In-depth (~1500 words)">In-depth (~1500 words)</option>
              </select>
            </div>
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Target Audience</label>
            <input type="text" id="w-audience" placeholder="e.g. Technology Executives & Engineers" style="width:100%;" />
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">SEO Keywords (Comma separated)</label>
            <input type="text" id="w-keywords" placeholder="e.g. SaaS, cloud architecture, AI engineering" style="width:100%;" />
          </div>
        `;
        break;

      case 'essay':
        fieldsContainer.innerHTML = `
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Essay Topic</label>
            <input type="text" id="w-topic" placeholder="e.g. The Socio-Economic Impact of Quantum Cryptography" style="width:100%;" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Academic Level</label>
              <select id="w-acad-level" style="width:100%;">
                <option value="High School">High School</option>
                <option value="Undergraduate" selected>Undergraduate</option>
                <option value="Graduate / Master's">Graduate / Master's</option>
                <option value="Doctoral / PhD">Doctoral / PhD</option>
              </select>
            </div>
            <div>
              <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Citation Style</label>
              <select id="w-citation" style="width:100%;">
                <option value="APA 7th">APA 7th</option>
                <option value="MLA 9th">MLA 9th</option>
                <option value="Chicago / Turabian">Chicago / Turabian</option>
                <option value="IEEE">IEEE</option>
              </select>
            </div>
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Thesis Statement / Argument</label>
            <textarea id="w-thesis" rows="3" placeholder="Core claim or thesis statement to substantiate" style="width:100%;"></textarea>
          </div>
        `;
        break;

      case 'email':
        fieldsContainer.innerHTML = `
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Recipient / Stakeholder</label>
            <input type="text" id="w-recipient" placeholder="e.g. Senior VP of Product Engineering" style="width:100%;" />
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Email Objective</label>
            <input type="text" id="w-goal" placeholder="e.g. Request quarterly budget sign-off for cloud migration" style="width:100%;" />
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Tone</label>
            <select id="w-tone" style="width:100%;">
              <option value="Professional & Diplomatic">Professional & Diplomatic</option>
              <option value="Urgent & Action-Oriented">Urgent & Action-Oriented</option>
              <option value="Warm & Friendly">Warm & Friendly</option>
              <option value="Executive Brief">Executive Brief</option>
            </select>
          </div>
        `;
        break;

      case 'social':
        fieldsContainer.innerHTML = `
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Platform</label>
            <select id="w-platform" style="width:100%;">
              <option value="LinkedIn Post">LinkedIn Post</option>
              <option value="Twitter / X Thread">Twitter / X Thread</option>
              <option value="Instagram Caption">Instagram Caption</option>
            </select>
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Topic / Key Milestone</label>
            <textarea id="w-topic" rows="3" placeholder="e.g. Just launched MR.SALL AI platform with real-time Apple-inspired interface" style="width:100%;"></textarea>
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Tone</label>
            <select id="w-tone" style="width:100%;">
              <option value="Viral & Inspiring">Viral & Inspiring</option>
              <option value="Thought Leadership">Thought Leadership</option>
              <option value="Engaging & Playful">Engaging & Playful</option>
            </select>
          </div>
        `;
        break;

      case 'prompt':
        fieldsContainer.innerHTML = `
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Target Role / AI Persona</label>
            <input type="text" id="w-role" placeholder="e.g. Senior Cloud Security Architect" style="width:100%;" />
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Desired Task & Goal</label>
            <textarea id="w-task" rows="3" placeholder="e.g. Review Terraform scripts for security vulnerabilities and recommend fixes" style="width:100%;"></textarea>
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Constraints / Output Format</label>
            <input type="text" id="w-constraints" placeholder="e.g. Return Markdown checklist with code snippets only" style="width:100%;" />
          </div>
        `;
        break;

      case 'summarizer':
      case 'grammar':
      case 'rewriter':
        fieldsContainer.innerHTML = `
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Source Text</label>
            <textarea id="w-source-text" rows="8" placeholder="Paste your text here to process..." style="width:100%;"></textarea>
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Mode / Target Style</label>
            <select id="w-mode" style="width:100%;">
              <option value="Executive Bullet Points">Executive Bullet Points</option>
              <option value="Polished & Fluent">Polished & Fluent</option>
              <option value="Concise Summary">Concise Summary</option>
              <option value="Creative & Expressive">Creative & Expressive</option>
            </select>
          </div>
        `;
        break;

      case 'ideas':
        fieldsContainer.innerHTML = `
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Industry / Niche</label>
            <input type="text" id="w-industry" placeholder="e.g. FinTech & AI SaaS" style="width:100%;" />
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Business / Content Goal</label>
            <textarea id="w-goal" rows="4" placeholder="e.g. Acquire 10,000 developers for our new API platform through educational content" style="width:100%;"></textarea>
          </div>
        `;
        break;
    }
  }

  bindEvents(container) {
    const tabs = container.querySelectorAll('.writing-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active-tab'));
        tab.classList.add('active-tab');
        this.activeTool = tab.getAttribute('data-tool');
        this.renderFormForTool(this.activeTool, container);
      });
    });

    const generateBtn = container.querySelector('#btn-writing-generate');
    generateBtn.addEventListener('click', () => this.handleGenerate(container));

    const copyBtn = container.querySelector('#btn-writing-copy');
    copyBtn.addEventListener('click', () => {
      const text = container.querySelector('#writing-output-area').innerText;
      if (text) {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      }
    });

    const favBtn = container.querySelector('#btn-writing-fav');
    favBtn.addEventListener('click', () => {
      const text = container.querySelector('#writing-output-area').innerText;
      if (text) {
        storage.addFavorite({
          itemType: 'writing',
          title: `AI Writing: ${this.activeTool.toUpperCase()}`,
          content: text
        });
        toast.success('Saved to favorites!');
      }
    });

    const downloadBtn = container.querySelector('#btn-writing-download');
    downloadBtn.addEventListener('click', () => {
      const text = container.querySelector('#writing-output-area').innerText;
      if (!text) return;
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mrsall-${this.activeTool}-${Date.now()}.md`;
      a.click();
    });
  }

  async handleGenerate(container) {
    if (this.isGenerating) return;
    const outputArea = container.querySelector('#writing-output-area');
    const btnText = container.querySelector('#writing-btn-text');

    // Collect parameters
    const params = {
      topic: container.querySelector('#w-topic')?.value,
      tone: container.querySelector('#w-tone')?.value,
      length: container.querySelector('#w-length')?.value,
      audience: container.querySelector('#w-audience')?.value,
      keywords: container.querySelector('#w-keywords')?.value,
      academicLevel: container.querySelector('#w-acad-level')?.value,
      citationStyle: container.querySelector('#w-citation')?.value,
      thesis: container.querySelector('#w-thesis')?.value,
      recipient: container.querySelector('#w-recipient')?.value,
      goal: container.querySelector('#w-goal')?.value,
      platform: container.querySelector('#w-platform')?.value,
      role: container.querySelector('#w-role')?.value,
      task: container.querySelector('#w-task')?.value,
      constraints: container.querySelector('#w-constraints')?.value,
      text: container.querySelector('#w-source-text')?.value,
      mode: container.querySelector('#w-mode')?.value,
      industry: container.querySelector('#w-industry')?.value
    };

    this.isGenerating = true;
    btnText.textContent = 'Generating Content...';
    outputArea.innerHTML = `<span style="color:var(--apple-blue); animation:pulseGlow 1.5s infinite;">MR.SALL AI writing engine synthesizing content...</span>`;

    try {
      const result = await api.generateWriting(this.activeTool, params);
      outputArea.innerText = result;

      // Update counters
      const words = result.trim().split(/\s+/).filter(Boolean).length;
      container.querySelector('#stat-words').textContent = words;
      container.querySelector('#stat-chars').textContent = result.length;

      // Log in history
      storage.addToolHistory({
        toolName: `AI Writing: ${this.activeTool}`,
        toolCategory: 'writing',
        inputSnippet: params.topic || params.text?.substring(0, 80) || 'Parameters',
        outputSnippet: result.substring(0, 160)
      });

      toast.success('Content generated successfully!');
    } catch (err) {
      console.error(err);
      const isConfig = err.message.includes('CONFIG_REQUIRED');
      outputArea.innerHTML = `
        <div style="color:var(--apple-red); background:rgba(255,59,48,0.08); padding:12px; border-radius:10px;">
          <strong>Generation Failed:</strong> ${err.message}
          ${isConfig ? `<br/><button id="btn-write-config-key" class="btn-primary" style="margin-top:10px; font-size:12px; padding:6px 14px;">Connect Gemini API Key</button>` : ''}
        </div>
      `;
      if (isConfig) {
        outputArea.querySelector('#btn-write-config-key')?.addEventListener('click', () => modal.showApiKeyModal());
      }
    } finally {
      this.isGenerating = false;
      btnText.textContent = 'Generate with AI';
    }
  }
}

export const writingStudioPage = new WritingStudioPage();
