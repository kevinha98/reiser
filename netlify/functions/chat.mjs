/**
 * Netlify Function — LLM proxy for Radical Gateway
 * The API key lives server-side; the browser never sees it.
 * Route: POST /api/chat  →  POST https://gateway.raicode.no/v1/chat/completions
 */

const GATEWAY_URL = 'https://gateway.raicode.no/v1/chat/completions'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const apiKey = process.env.RADICAL_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Server configuration error: missing RADICAL_API_KEY env var' }),
    }
  }

  try {
    const response = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: event.body ?? '{}',
    })

    const text = await response.text()
    return { statusCode: response.status, headers: CORS, body: text }
  } catch (err) {
    return {
      statusCode: 502,
      headers: CORS,
      body: JSON.stringify({ error: `Proxy error: ${String(err)}` }),
    }
  }
}
