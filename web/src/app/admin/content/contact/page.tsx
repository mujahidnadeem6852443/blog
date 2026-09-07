"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { API_URL } from "@/lib/api";
import type { ContactContent } from "@/lib/content";

export default function EditContactPage() {
  const router = useRouter();
  const [values, setValues] = useState<ContactContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/pages/contact`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setValues(data?.data ?? { email: "", linkedin: "", github: "" }));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`${API_URL}/api/admin/pages/contact`, {
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
      <h1>Edit Contact</h1>
      <form onSubmit={handleSubmit} className="stack" style={{ maxWidth: 480, marginTop: 16 }}>
        <div>
          <label>Email</label>
          <input value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        </div>
        <div>
          <label>LinkedIn URL</label>
          <input value={values.linkedin} onChange={(e) => setValues({ ...values, linkedin: e.target.value })} />
        </div>
        <div>
          <label>GitHub URL</label>
          <input value={values.github} onChange={(e) => setValues({ ...values, github: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
}
