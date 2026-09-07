"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { RepeatableList } from "@/components/RepeatableList";
import { API_URL } from "@/lib/api";
import type { ExperienceContent } from "@/lib/content";

export default function EditExperiencePage() {
  const router = useRouter();
  const [values, setValues] = useState<ExperienceContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/pages/experience`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setValues(data?.data ?? { items: [] }));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`${API_URL}/api/admin/pages/experience`, {
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
      <h1>Edit Experience</h1>
      <form onSubmit={handleSubmit} className="stack" style={{ maxWidth: 640, marginTop: 16 }}>
        <RepeatableList
          items={values.items}
          onChange={(items) => setValues({ items })}
          newItem={{ role: "", company: "", start: "", end: "", description: "" }}
          addLabel="+ Add experience"
          renderItem={(item, update) => (
            <>
              <div className="row">
                <input placeholder="Role" value={item.role} onChange={(e) => update({ role: e.target.value })} />
                <input
                  placeholder="Company"
                  value={item.company}
                  onChange={(e) => update({ company: e.target.value })}
                />
              </div>
              <div className="row">
                <input placeholder="Start" value={item.start} onChange={(e) => update({ start: e.target.value })} />
                <input placeholder="End" value={item.end} onChange={(e) => update({ end: e.target.value })} />
              </div>
              <textarea
                placeholder="Description"
                rows={2}
                value={item.description}
                onChange={(e) => update({ description: e.target.value })}
              />
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
