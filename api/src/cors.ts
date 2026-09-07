// The frontend and API run on different origins, so the browser enforces CORS.
// Because requests carry a session cookie, the allowed origin must be an explicit
// allowlist match (never "*") and credentials must be permitted.

function allowedOriginList(allowedOrigins: string): string[] {
  return allowedOrigins
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

export function resolveCorsOrigin(request: Request, allowedOrigins: string): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  return allowedOriginList(allowedOrigins).includes(origin) ? origin : null;
}

export function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

export function handlePreflight(request: Request, allowedOrigins: string): Response | null {
  if (request.method !== "OPTIONS") return null;
  const origin = resolveCorsOrigin(request, allowedOrigins);
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders(origin),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
