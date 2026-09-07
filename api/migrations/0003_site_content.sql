-- Editable content for the static public pages (Home, About, Experience,
-- Projects, Contact). Each row's `data` is a JSON blob whose shape depends
-- on the page — validated loosely at the API layer, not by SQLite.
CREATE TABLE IF NOT EXISTS site_content (
  page TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
