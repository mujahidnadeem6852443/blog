import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const about = await getPageContent("about");

  if (!about) {
    return (
      <div className="container section">
        <h1>About</h1>
        <p>Content for this page has not been finalized yet.</p>
      </div>
    );
  }

  return (
    <div>
      <section className="section">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>Who I Am</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            {about.bio}
          </p>
        </div>
      </section>

      {about.pillars?.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="grid grid-auto">
              {about.pillars.map((pillar) => (
                <div key={pillar.title} className="card">
                  <div className="pillar-title">{pillar.title}</div>
                  <p>{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {about.skills?.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-header">
              <h2>Skills</h2>
            </div>
            <div className="row">
              {about.skills.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {about.education?.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-header">
              <h2>Education</h2>
            </div>
            <div className="stack">
              {about.education.map((edu) => (
                <div key={edu.institution} className="timeline-item">
                  <div className="timeline-role">{edu.degree}</div>
                  <div className="timeline-meta">
                    {edu.institution} &middot; {edu.start} &ndash; {edu.end}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
