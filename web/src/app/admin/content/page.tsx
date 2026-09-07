"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

const sections = [
  { page: "home", label: "Home" },
  { page: "about", label: "About" },
  { page: "experience", label: "Experience" },
  { page: "projects", label: "Projects" },
  { page: "contact", label: "Contact" },
];

interface PageRow {
  page: string;
  updated_at: number;
}

export default function AdminContentIndexPage() {
  const [rows, setRows] = useState<PageRow[] | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/pages`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRows(data.pages));
  }, []);

  function lastUpdated(page: string): string {
    const row = rows?.find((r) => r.page === page);
    if (!row) return "not set";
    return new Date(row.updated_at * 1000).toLocaleString();
  }

  return (
    <div>
      <h1>Site Content</h1>
      <p className="muted">
        Edit the text shown on the public Home, About, Experience, Projects, and Contact pages.
      </p>
      <div className="stack" style={{ marginTop: 20 }}>
        {sections.map((section) => (
          <div key={section.page} className="card row" style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700 }}>{section.label}</div>
              <div className="muted" style={{ fontSize: "0.85rem" }}>
                {rows ? `Updated ${lastUpdated(section.page)}` : "Loading…"}
              </div>
            </div>
            <Link href={`/admin/content/${section.page}`} className="btn btn-secondary">
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
