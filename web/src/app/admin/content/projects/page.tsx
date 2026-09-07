"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { RepeatableList } from "@/components/RepeatableList";
import { API_URL } from "@/lib/api";
import type { ProjectsContent } from "@/lib/content";

export default function EditProjectsPage() {
  const router = useRouter();
  const [values, setValues] = useState<ProjectsContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/pages/projects`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setValues(data?.data ?? { items: [] }));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`${API_URL}/api/admin/pages/projects`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      return;
    }
    router.push("/admin/content");
  }

  if (!values) return <p>Loading…</p>;

  return (
    <div>
      <h1>Edit Projects</h1>
      <form onSubmit={handleSubmit} className="stack" style={{ maxWidth: 640, marginTop: 16 }}>
        <RepeatableList
          items={values.items}
          onChange={(items) => setValues({ items })}
          newItem={{ title: "", description: "", link: "" }}
          addLabel="+ Add project"
          renderItem={(item, update) => (
            <>
              <input placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              <textarea
                placeholder="Description"
                rows={2}
                value={item.description}
                onChange={(e) => update({ description: e.target.value })}
              />
              <input placeholder="Link" value={item.link} onChange={(e) => update({ link: e.target.value })} />
            </>
          )}
        />
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
}
