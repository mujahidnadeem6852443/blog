import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Experience",
};

export default async function ExperiencePage() {
  const experience = await getPageContent("experience");

  return (
    <div className="section">
      <div className="container">
        <span className="eyebrow">Career</span>
        <h1>Experience</h1>

        {!experience || experience.items.length === 0 ? (
          <p style={{ marginTop: 16 }}>Content for this page has not been finalized yet.</p>
        ) : (
          <div className="stack" style={{ marginTop: 32 }}>
            {experience.items.map((item) => (
              <div key={`${item.role}-${item.company}`} className="timeline-item">
                <div className="timeline-role">
                  {item.role} &middot; {item.company}
                </div>
                <div className="timeline-meta">
                  {item.start} &ndash; {item.end}
                </div>
                <p style={{ marginTop: 10 }}>{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
