"use client";

import { useState, type FormEvent } from "react";

export interface PostFormValues {
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
}

export function PostForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues: PostFormValues;
  onSubmit: (values: PostFormValues) => Promise<string | void>;
  submitLabel: string;
}) {
  const [title, setTitle] = useState(initialValues.title);
  const [slug, setSlug] = useState(initialValues.slug);
  const [content, setContent] = useState(initialValues.content);
  const [status, setStatus] = useState<PostFormValues["status"]>(initialValues.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await onSubmit({ title, slug, content, status });
    setSaving(false);
    if (result) setError(result);
  }

  return (
    <form onSubmit={handleSubmit} className="stack" style={{ maxWidth: 680, marginTop: 16 }}>
      <div>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Slug</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </div>
      <div>
        <label>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14} required />
      </div>
      <label className="row" style={{ cursor: "pointer" }}>
        <input
          type="checkbox"
          style={{ width: "auto" }}
          checked={status === "published"}
          onChange={(e) => setStatus(e.target.checked ? "published" : "draft")}
        />
        Published
      </label>
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Saving…" : submitLabel}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
