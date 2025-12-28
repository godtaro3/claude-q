// Anthropic API Proxy - Solves CORS issues
// POST /api/claude

export const runtime = 'edge';
export const maxDuration = 60;

export async function POST(request) {
  try {
    const body = await request.json();
    const { apiKey, ...requestBody } = body;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(request.url);
    if (url.searchParams.get('stop') === 'true') {
      return new Response(
        JSON.stringify({ error: 'Queue stopped via kill switch', killed: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });

    if (requestBody.stream) {
      return new Response(anthropicResponse.body, {
        status: anthropicResponse.status,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      return new Response(
        JSON.stringify({
          error: data.error?.message || 'API request failed',
          type: data.error?.type || 'api_error',
          status: anthropicResponse.status,
        }),
        { status: anthropicResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Claude API proxy error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        type: 'network',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
