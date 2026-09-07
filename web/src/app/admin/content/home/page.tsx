"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { API_URL } from "@/lib/api";
import type { HomeContent } from "@/lib/content";

export default function EditHomePage() {
  const router = useRouter();
  const [values, setValues] = useState<HomeContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/pages/home`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) =>
        setValues(data?.data ?? { name: "", title: "", tagline: "", bio: "" }),
      );
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`${API_URL}/api/admin/pages/home`, {
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
      <h1>Edit Home</h1>
      <form onSubmit={handleSubmit} className="stack" style={{ maxWidth: 560, marginTop: 16 }}>
        <div>
          <label>Name</label>
          <input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} required />
        </div>
        <div>
          <label>Title / role</label>
          <input value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} required />
        </div>
        <div>
          <label>Tagline</label>
          <input value={values.tagline} onChange={(e) => setValues({ ...values, tagline: e.target.value })} />
        </div>
        <div>
          <label>Bio</label>
          <textarea
            rows={5}
            value={values.bio}
            onChange={(e) => setValues({ ...values, bio: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
}
