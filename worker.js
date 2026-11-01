/**
 * MR.SALL AI — Cloudflare Worker Backend API Router
 * Production-ready Edge Worker with Zero Trust Security & Modular AI Gateway
 */

import { handleAiChat, handleAiWriting, handleAiTranslation } from './ai-service.js';
import { handleAuthRegister, handleAuthLogin, handleAuthMe, verifyToken } from './auth-service.js';
import { getUsageQuotas, recordUsage, getAdminStats } from './db-service.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: getCorsHeaders(env)
      });
    }

    // 2. Health check route
    if (url.pathname === '/api/health') {
      return jsonResponse({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        platform: 'MR.SALL AI Cloudflare Worker',
        brand: 'MR.SALL AI — Intelligence Without Limits'
      }, 200, env);
    }

    try {
      // 3. Authentication Routes
      if (url.pathname === '/api/auth/register' && request.method === 'POST') {
        const body = await request.json();
        return await handleAuthRegister(body, env);
      }

      if (url.pathname === '/api/auth/login' && request.method === 'POST') {
        const body = await request.json();
        return await handleAuthLogin(body, env);
      }

      if (url.pathname === '/api/auth/me' && request.method === 'GET') {
        const user = await verifyToken(request, env);
        if (!user) return jsonResponse({ error: 'Unauthorized' }, 401, env);
        return await handleAuthMe(user, env);
      }

      // 4. AI Routes (Streaming & Multi-model)
      if (url.pathname === '/api/chat' && request.method === 'POST') {
        const body = await request.json();
        const user = await verifyToken(request, env);
        return await handleAiChat(body, user, env);
      }

      if (url.pathname === '/api/write' && request.method === 'POST') {
        const body = await request.json();
        const user = await verifyToken(request, env);
        return await handleAiWriting(body, user, env);
      }

      if (url.pathname === '/api/translate' && request.method === 'POST') {
        const body = await request.json();
        const user = await verifyToken(request, env);
        return await handleAiTranslation(body, user, env);
      }

      // 5. Usage Quotas & History
      if (url.pathname === '/api/usage' && request.method === 'GET') {
        const user = await verifyToken(request, env);
        return await getUsageQuotas(user, env);
      }

      // 6. Admin Telemetry
      if (url.pathname === '/api/admin/stats' && request.method === 'GET') {
        const user = await verifyToken(request, env);
        if (user?.role !== 'admin') {
          return jsonResponse({ error: 'Admin privileges required' }, 403, env);
        }
        return await getAdminStats(env);
      }

      return jsonResponse({ error: `Route not found: ${url.pathname}` }, 404, env);
    } catch (err) {
      console.error('Unhandled Worker error:', err);
      return jsonResponse({ error: err.message || 'Internal Server Error' }, 500, env);
    }
  }
};

function getCorsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400'
  };
}

export function jsonResponse(data, status = 200, env = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(env)
    }
  });
}
