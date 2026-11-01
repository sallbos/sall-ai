/**
 * MR.SALL AI — Backend Modular AI Gateway
 * Connects securely to Google Gemini API, OpenAI, or Cloudflare Workers AI
 */

import { jsonResponse } from './worker.js';

export async function handleAiChat(body, user, env) {
  const { messages, options = {} } = body;
  if (!messages || !Array.isArray(messages)) {
    return jsonResponse({ error: 'Invalid messages array' }, 400, env);
  }

  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse({
      error: 'GEMINI_API_KEY environment secret is not configured on Cloudflare Worker.'
    }, 503, env);
  }

  const model = options.model || env.GEMINI_MODEL || 'gemini-1.5-flash';
  const contents = messages.map(m => ({
    role: m.sender === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}`;

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
    return jsonResponse({ error: errorData?.error?.message || response.statusText }, response.status, env);
  }

  // Stream chunks back to client with TransformStream
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        // Extract text candidate
        const matches = text.match(/"text":\s*"((?:\\.|[^"\\])*)"/g);
        if (matches) {
          for (const m of matches) {
            const raw = m.replace(/^"text":\s*"/, '').replace(/"$/, '');
            const clean = raw.replace(/\\n/g, '\n').replace(/\\"/g, '"');
            await writer.write(new TextEncoder().encode(clean));
          }
        }
      }
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function handleAiWriting(body, user, env) {
  const { tool, params } = body;
  const prompt = `You are MR.SALL AI writing assistant. Generate content for tool: ${tool}. Parameters: ${JSON.stringify(params)}`;
  return handleAiChat({ messages: [{ sender: 'user', content: prompt }] }, user, env);
}

export async function handleAiTranslation(body, user, env) {
  const { text, sourceLang, targetLang } = body;
  const prompt = `Translate this text from ${sourceLang} to ${targetLang}. Return only translation:\n${text}`;
  return handleAiChat({ messages: [{ sender: 'user', content: prompt }] }, user, env);
}
