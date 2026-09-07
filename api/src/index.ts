import { generateSessionToken, hashToken, verifyPassword } from "./auth";

export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD_HASH: string;
}

const SESSION_COOKIE = "session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60;

function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

function serializeCookie(name: string, value: string, maxAgeSeconds: number): string {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

function clearCookie(name: string): string {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? match[1] : null;
}

async function getValidSession(
  request: Request,
  env: Env,
): Promise<{ tokenHash: string } | null> {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;

  const tokenHash = await hashToken(token);
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare("SELECT expires_at FROM sessions WHERE token_hash = ?")
    .bind(tokenHash)
    .first<{ expires_at: number }>();

  if (!row || row.expires_at < now) return null;
  return { tokenHash };
}

// Exported so admin routes (posts CRUD, etc.) can require a valid session.
export async function requireSession(request: Request, env: Env): Promise<Response | null> {
  const session = await getValidSession(request, env);
  return session ? null : json({ error: "Unauthorized" }, 401);
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const now = Math.floor(Date.now() / 1000);

  const attempt = await env.DB.prepare(
    "SELECT failed_count, locked_until FROM login_attempts WHERE ip = ?",
  )
    .bind(ip)
    .first<{ failed_count: number; locked_until: number | null }>();

  if (attempt?.locked_until && attempt.locked_until > now) {
    return json({ error: "Too many attempts. Try again later." }, 429);
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  if (typeof body.password !== "string" || body.password.length === 0) {
    return json({ error: "Password required" }, 400);
  }

  const valid = await verifyPassword(body.password, env.ADMIN_PASSWORD_HASH);

  if (!valid) {
    const failedCount = (attempt?.failed_count ?? 0) + 1;
    const lockedUntil = failedCount >= MAX_LOGIN_ATTEMPTS ? now + LOCKOUT_SECONDS : null;
    await env.DB.prepare(
      `INSERT INTO login_attempts (ip, failed_count, locked_until) VALUES (?, ?, ?)
       ON CONFLICT(ip) DO UPDATE SET failed_count = excluded.failed_count, locked_until = excluded.locked_until`,
    )
      .bind(ip, failedCount, lockedUntil)
      .run();
    return json({ error: "Invalid password" }, 401);
  }

  await env.DB.prepare("DELETE FROM login_attempts WHERE ip = ?").bind(ip).run();

  const token = generateSessionToken();
  const tokenHash = await hashToken(token);
  const expiresAt = now + SESSION_TTL_SECONDS;
  await env.DB.prepare("INSERT INTO sessions (token_hash, created_at, expires_at) VALUES (?, ?, ?)")
    .bind(tokenHash, now, expiresAt)
    .run();

  return json(
    { authenticated: true },
    200,
    { "set-cookie": serializeCookie(SESSION_COOKIE, token, SESSION_TTL_SECONDS) },
  );
}

async function handleLogout(request: Request, env: Env): Promise<Response> {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    const tokenHash = await hashToken(token);
    await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
  }
  return json({ authenticated: false }, 200, { "set-cookie": clearCookie(SESSION_COOKIE) });
}

async function handleSessionCheck(request: Request, env: Env): Promise<Response> {
  const session = await getValidSession(request, env);
  return json({ authenticated: session !== null });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") return json({ status: "ok" });
    if (url.pathname === "/api/login" && request.method === "POST") {
      return handleLogin(request, env);
    }
    if (url.pathname === "/api/logout" && request.method === "POST") {
      return handleLogout(request, env);
    }
    if (url.pathname === "/api/session" && request.method === "GET") {
      return handleSessionCheck(request, env);
    }

    return json({ error: "Not found" }, 404);
  },
} satisfies ExportedHandler<Env>;
