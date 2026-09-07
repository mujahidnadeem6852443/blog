"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { RepeatableList } from "@/components/RepeatableList";
import { API_URL } from "@/lib/api";
import type { AboutContent } from "@/lib/content";

const empty: AboutContent = { bio: "", pillars: [], skills: [], education: [] };

export default function EditAboutPage() {
  const router = useRouter();
  const [values, setValues] = useState<AboutContent | null>(null);
  const [skillsText, setSkillsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/pages/about`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const content: AboutContent = data?.data ?? empty;
        setValues(content);
        setSkillsText(content.skills.join(", "));
      });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    setError(null);
    const payload: AboutContent = {
      ...values,
      skills: skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const res = await fetch(`${API_URL}/api/admin/pages/about`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      <h1>Edit About</h1>
      <form onSubmit={handleSubmit} className="stack" style={{ maxWidth: 640, marginTop: 16 }}>
        <div>
          <label>Bio</label>
          <textarea rows={5} value={values.bio} onChange={(e) => setValues({ ...values, bio: e.target.value })} />
        </div>

        <div>
          <label>Pillars</label>
          <RepeatableList
            items={values.pillars}
            onChange={(pillars) => setValues({ ...values, pillars })}
            newItem={{ title: "", description: "" }}
            addLabel="+ Add pillar"
            renderItem={(item, update) => (
              <>
                <input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  rows={2}
                  value={item.description}
                  onChange={(e) => update({ description: e.target.value })}
                />
              </>
            )}
          />
        </div>

        <div>
          <label>Skills (comma-separated)</label>
          <input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
        </div>

        <div>
          <label>Education</label>
          <RepeatableList
            items={values.education}
            onChange={(education) => setValues({ ...values, education })}
            newItem={{ institution: "", degree: "", start: "", end: "" }}
            addLabel="+ Add education"
            renderItem={(item, update) => (
              <>
                <input
                  placeholder="Institution"
                  value={item.institution}
                  onChange={(e) => update({ institution: e.target.value })}
                />
                <input
                  placeholder="Degree"
                  value={item.degree}
                  onChange={(e) => update({ degree: e.target.value })}
                />
                <div className="row">
                  <input
                    placeholder="Start year"
                    value={item.start}
                    onChange={(e) => update({ start: e.target.value })}
                  />
                  <input
                    placeholder="End year"
                    value={item.end}
                    onChange={(e) => update({ end: e.target.value })}
                  />
                </div>
              </>
            )}
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
