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
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Title{" "}
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Slug{" "}
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Content
          <br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            cols={60}
            required
          />
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={status === "published"}
            onChange={(e) => setStatus(e.target.checked ? "published" : "draft")}
          />{" "}
          Published
        </label>
      </div>
      <button type="submit" disabled={saving}>
        {saving ? "Saving…" : submitLabel}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
