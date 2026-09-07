import { corsHeaders, handlePreflight, resolveCorsOrigin } from "./cors";
import { json } from "./http";
import {
  createPost,
  deletePost,
  getPostById,
  getPublishedPost,
  listAllPosts,
  listPublishedPosts,
  updatePost,
} from "./posts";
import { handleLogin, handleLogout, handleSessionCheck, requireSession } from "./session";
import type { Env } from "./types";

export type { Env };

async function route(request: Request, env: Env): Promise<Response> {
  const { pathname } = new URL(request.url);
  const { method } = request;

  if (pathname === "/") return json({ status: "ok" });

  if (pathname === "/api/login" && method === "POST") return handleLogin(request, env);
  if (pathname === "/api/logout" && method === "POST") return handleLogout(request, env);
  if (pathname === "/api/session" && method === "GET") return handleSessionCheck(request, env);

  if (pathname === "/api/posts" && method === "GET") return listPublishedPosts(env);

  const publicPostMatch = pathname.match(/^\/api\/posts\/([^/]+)$/);
  if (publicPostMatch && method === "GET") return getPublishedPost(env, publicPostMatch[1]);

  if (pathname.startsWith("/api/admin/")) {
    const unauthorized = await requireSession(request, env);
    if (unauthorized) return unauthorized;

    if (pathname === "/api/admin/posts") {
      if (method === "GET") return listAllPosts(env);
      if (method === "POST") return createPost(request, env);
    }

    const adminPostMatch = pathname.match(/^\/api\/admin\/posts\/([^/]+)$/);
    if (adminPostMatch) {
      const id = adminPostMatch[1];
      if (method === "GET") return getPostById(env, id);
      if (method === "PUT") return updatePost(request, env, id);
      if (method === "DELETE") return deletePost(env, id);
    }
  }

  return json({ error: "Not found" }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const preflight = handlePreflight(request, env.ALLOWED_ORIGINS);
    if (preflight) return preflight;

    let response: Response;
    try {
      response = await route(request, env);
    } catch (err) {
      console.error(err);
      response = json({ error: "Internal server error" }, 500);
    }

    const origin = resolveCorsOrigin(request, env.ALLOWED_ORIGINS);
    for (const [key, value] of Object.entries(corsHeaders(origin))) {
      response.headers.set(key, value);
    }
    return response;
  },
} satisfies ExportedHandler<Env>;
