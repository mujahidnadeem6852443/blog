import { json } from "./http";
import type { Env } from "./types";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface ValidPostInput {
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
}

function validatePostInput(body: unknown): ValidPostInput | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  if (typeof b.title !== "string" || b.title.trim().length === 0) {
    return { error: "Title is required" };
  }
  if (typeof b.slug !== "string" || !SLUG_PATTERN.test(b.slug)) {
    return { error: "Slug must be lowercase letters, numbers, and hyphens" };
  }
  if (typeof b.content !== "string") {
    return { error: "Content is required" };
  }

  const status = b.status === "published" ? "published" : "draft";
  return { title: b.title.trim(), slug: b.slug, content: b.content, status };
}

// --- Public: published posts only ---

export async function listPublishedPosts(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    "SELECT id, slug, title, published_at FROM posts WHERE status = 'published' ORDER BY published_at DESC",
  ).all();
  return json({ posts: results });
}

export async function getPublishedPost(env: Env, slug: string): Promise<Response> {
  const post = await env.DB.prepare(
    "SELECT id, slug, title, content, published_at FROM posts WHERE status = 'published' AND slug = ?",
  )
    .bind(slug)
    .first();
  if (!post) return json({ error: "Not found" }, 404);
  return json({ post });
}

// --- Admin: all posts, protected by requireSession at the router level ---

export async function listAllPosts(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    "SELECT id, slug, title, status, created_at, updated_at, published_at FROM posts ORDER BY updated_at DESC",
  ).all();
  return json({ posts: results });
}

export async function getPostById(env: Env, id: string): Promise<Response> {
  const post = await env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
  if (!post) return json({ error: "Not found" }, 404);
  return json({ post });
}

export async function createPost(request: Request, env: Env): Promise<Response> {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const input = validatePostInput(rawBody);
  if ("error" in input) return json({ error: input.error }, 400);

  const slugConflict = await env.DB.prepare("SELECT id FROM posts WHERE slug = ?")
    .bind(input.slug)
    .first();
  if (slugConflict) return json({ error: "Slug already in use" }, 409);

  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const publishedAt = input.status === "published" ? now : null;

  await env.DB.prepare(
    `INSERT INTO posts (id, slug, title, content, status, created_at, updated_at, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, input.slug, input.title, input.content, input.status, now, now, publishedAt)
    .run();

  return json({ id }, 201);
}

export async function updatePost(request: Request, env: Env, id: string): Promise<Response> {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const input = validatePostInput(rawBody);
  if ("error" in input) return json({ error: input.error }, 400);

  const existing = await env.DB.prepare("SELECT id, published_at FROM posts WHERE id = ?")
    .bind(id)
    .first<{ id: string; published_at: number | null }>();
  if (!existing) return json({ error: "Not found" }, 404);

  const slugConflict = await env.DB.prepare("SELECT id FROM posts WHERE slug = ? AND id != ?")
    .bind(input.slug, id)
    .first();
  if (slugConflict) return json({ error: "Slug already in use" }, 409);

  const now = Math.floor(Date.now() / 1000);
  const publishedAt = input.status === "published" ? (existing.published_at ?? now) : null;

  await env.DB.prepare(
    "UPDATE posts SET slug = ?, title = ?, content = ?, status = ?, updated_at = ?, published_at = ? WHERE id = ?",
  )
    .bind(input.slug, input.title, input.content, input.status, now, publishedAt, id)
    .run();

  return json({ id });
}

export async function deletePost(env: Env, id: string): Promise<Response> {
  const result = await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  if (result.meta.changes === 0) return json({ error: "Not found" }, 404);
  return json({ deleted: true });
}
