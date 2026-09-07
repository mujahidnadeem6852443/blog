import { json } from "./http";
import type { Env } from "./types";

// Fixed set of editable static pages — not open-ended, so a typo in the URL
// can't create junk rows or let an admin edit something unexpected.
const PAGES = ["home", "about", "experience", "projects", "contact"] as const;
type Page = (typeof PAGES)[number];

function isPage(value: string): value is Page {
  return (PAGES as readonly string[]).includes(value);
}

export async function getPublicPage(env: Env, page: string): Promise<Response> {
  if (!isPage(page)) return json({ error: "Not found" }, 404);

  const row = await env.DB.prepare("SELECT data FROM site_content WHERE page = ?")
    .bind(page)
    .first<{ data: string }>();

  if (!row) return json({ error: "Not found" }, 404);
  return json({ page, data: JSON.parse(row.data) });
}

export async function listAdminPages(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    "SELECT page, updated_at FROM site_content ORDER BY page",
  ).all();
  return json({ pages: results });
}

export async function getAdminPage(env: Env, page: string): Promise<Response> {
  if (!isPage(page)) return json({ error: "Not found" }, 404);

  const row = await env.DB.prepare("SELECT data, updated_at FROM site_content WHERE page = ?")
    .bind(page)
    .first<{ data: string; updated_at: number }>();

  if (!row) return json({ error: "Not found" }, 404);
  return json({ page, data: JSON.parse(row.data), updated_at: row.updated_at });
}

export async function updatePage(request: Request, env: Env, page: string): Promise<Response> {
  if (!isPage(page)) return json({ error: "Not found" }, 404);

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return json({ error: "Content must be a JSON object" }, 400);
  }

  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    `INSERT INTO site_content (page, data, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(page) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
  )
    .bind(page, JSON.stringify(data), now)
    .run();

  return json({ page, updated_at: now });
}
