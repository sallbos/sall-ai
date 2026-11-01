/**
 * MR.SALL AI — API Service & AI Provider Connector
 * Handles communication with Cloudflare Workers backend and direct provider fallback
 */

import { storage } from './storage.js';

export class ApiService {
  constructor() {
    this.baseUrl = window.location.origin;
  }

  /**
   * Check if backend or API keys are active
   */
  hasApiKey() {
    const gemini = storage.getGeminiKey();
    const openai = storage.getOpenAIKey();
    return Boolean(gemini || openai);
  }

  /**
   * Core AI Completion Method (Streaming enabled)
   * Calls Cloudflare Worker /api/chat or client-side direct Gemini API if key is present
   */
  async *streamChat(messages, options = {}) {
    const user = storage.getCurrentUser();
    const usage = storage.getUsage();
    const limits = storage.getUsageLimits(user?.tier);

    // Enforce quota
    if (usage.messages >= limits.maxMessages) {
      throw new Error(`Daily quota reached (${limits.maxMessages} messages). Please upgrade to MR.SALL PRO for unlimited access.`);
    }

    const geminiKey = storage.getGeminiKey();
    const openaiKey = storage.getOpenAIKey();

    // 1. Try Backend Worker endpoint first
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storage.getAuthToken()}`
        },
        body: JSON.stringify({
          messages,
          options: {
            model: options.model || 'gemini-1.5-flash',
            temperature: options.temperature || 0.7
          }
        })
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        storage.incrementUsage('messages');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          yield chunk;
        }
        return;
      }
    } catch (workerErr) {
      // Backend not running on local static preview or network error
      console.warn('Backend /api/chat not reachable, checking direct provider keys...', workerErr);
    }

    // 2. Direct Google Gemini API integration (Client-side when running standalone)
    if (geminiKey) {
      const contents = messages.map(m => ({
        role: m.sender === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const model = options.model || 'gemini-1.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${geminiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: 2048
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Gemini API error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      storage.incrementUsage('messages');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        // Extract text chunks from Gemini streaming JSON array format
        const matches = [...buffer.matchAll(/"text":\s*"((?:\\.|[^"\\])*)"/g)];
        if (matches.length > 0) {
          // Yield latest extracted text
        }
      }

      // If parsing raw stream is complex, we can parse full response safely
      try {
        const parsed = JSON.parse(buffer);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const text = item.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) yield text;
          }
        }
      } catch (e) {
        // Fallback to text matching
        const textMatches = buffer.match(/"text":\s*"([^"]+)"/g);
        if (textMatches) {
          const combined = textMatches.map(m => m.replace(/"text":\s*"/, '').replace(/"$/, '')).join('');
          yield combined.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        }
      }
      return;
    }

    // 3. Direct OpenAI API integration
    if (openaiKey) {
      const formatted = messages.map(m => ({
        role: m.sender === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: options.model || 'gpt-4o-mini',
          messages: formatted,
          stream: true
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `OpenAI API Error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      storage.incrementUsage('messages');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.substring(6));
              const token = data.choices?.[0]?.delta?.content || '';
              if (token) yield token;
            } catch (err) {}
          }
        }
      }
      return;
    }

    // 4. If neither backend nor keys are configured, throw clear configuration instruction
    throw new Error('CONFIG_REQUIRED: No AI provider connected. Please configure your Google Gemini API key or backend in Settings to enable real AI generation.');
  }

  /**
   * AI Writing Generation
   */
  async generateWriting(toolType, parameters) {
    const prompt = this.buildWritingPrompt(toolType, parameters);
    let fullResponse = '';
    for await (const chunk of this.streamChat([{ sender: 'user', content: prompt }])) {
      fullResponse += chunk;
    }
    return fullResponse;
  }

  buildWritingPrompt(toolType, params) {
    const base = `You are MR.SALL AI, an elite AI writing architect. Craft exceptional, publication-ready prose.`;
    switch (toolType) {
      case 'article':
        return `${base}\nWrite a comprehensive, compelling article.\nTopic: ${params.topic}\nAudience: ${params.audience || 'General'}\nTone: ${params.tone || 'Authoritative and engaging'}\nLength: ${params.length || '800 words'}\nKeywords: ${params.keywords || 'None'}`;
      case 'essay':
        return `${base}\nWrite an academic essay.\nTopic: ${params.topic}\nAcademic Level: ${params.academicLevel || 'Undergraduate'}\nCitation Style: ${params.citationStyle || 'APA'}\nThesis: ${params.thesis || 'Not specified'}`;
      case 'email':
        return `${base}\nCompose a clear, effective email.\nRecipient: ${params.recipient}\nGoal: ${params.goal}\nTone: ${params.tone || 'Professional'}`;
      case 'social':
        return `${base}\nCreate high-engagement social media posts for ${params.platform || 'LinkedIn & Twitter'}.\nTopic: ${params.topic}\nTone: ${params.tone || 'Punchy and viral'}\nInclude relevant hashtags.`;
      case 'prompt':
        return `${base}\nDesign a production-grade, highly structured system prompt for an LLM.\nTask: ${params.task}\nRole/Persona: ${params.role}\nConstraints: ${params.constraints || 'None'}`;
      case 'summarizer':
        return `${base}\nSummarize the following text in mode: ${params.mode || 'Executive Key Points'}.\n\nText:\n${params.text}`;
      case 'grammar':
        return `${base}\nReview and correct all grammar, spelling, and stylistic flaws in this text. Provide both the corrected version and a concise summary of improvements.\n\nText:\n${params.text}`;
      case 'rewriter':
        return `${base}\nRewrite and elevate the following text. Mode: ${params.mode || 'Fluent and polished'}.\n\nText:\n${params.text}`;
      case 'ideas':
        return `${base}\nGenerate 10 high-value, creative content ideas and angles.\nIndustry: ${params.industry}\nGoal: ${params.goal}`;
      default:
        return `${base}\nTopic: ${params.topic}`;
    }
  }

  /**
   * AI Translation
   */
  async translate(text, sourceLang, targetLang) {
    const langNames = { en: 'English', ar: 'Arabic', fr: 'French' };
    const prompt = `You are MR.SALL AI, an expert linguist and neural translator.
Translate the following text faithfully, maintaining stylistic nuance, cultural context, and tone.
Source Language: ${langNames[sourceLang] || sourceLang}
Target Language: ${langNames[targetLang] || targetLang}

Text to translate:
"""
${text}
"""

Provide ONLY the translation itself without introductory phrases or conversational fillers.`;

    let translation = '';
    for await (const chunk of this.streamChat([{ sender: 'user', content: prompt }])) {
      translation += chunk;
    }
    return translation.trim();
  }
}

export const api = new ApiService();
