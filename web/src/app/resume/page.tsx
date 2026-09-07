import type { Metadata } from "next";
import { PrintButton } from "@/components/PrintButton";
import { getPageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resume",
};

export default async function ResumePage() {
  const [home, about, experience] = await Promise.all([
    getPageContent("home"),
    getPageContent("about"),
    getPageContent("experience"),
  ]);

  if (!home && !about && !experience) {
    return (
      <div className="container section">
        <h1>Resume</h1>
        <p>Content for this page has not been finalized yet.</p>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            {home && (
              <>
                <h1>{home.name}</h1>
                <p className="lede" style={{ marginTop: 8 }}>
                  {home.title}
                </p>
              </>
            )}
          </div>
          <PrintButton />
        </div>

        {(home?.bio ?? about?.bio) && (
          <p style={{ marginTop: 20, maxWidth: "70ch" }}>{home?.bio ?? about?.bio}</p>
        )}

        {experience && experience.items.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2>Experience</h2>
            <div className="stack" style={{ marginTop: 16 }}>
              {experience.items.map((item) => (
                <div key={`${item.role}-${item.company}`} className="timeline-item">
                  <div className="timeline-role">
                    {item.role} &middot; {item.company}
                  </div>
                  <div className="timeline-meta">
                    {item.start} &ndash; {item.end}
                  </div>
                  <p style={{ marginTop: 8 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {about?.education && about.education.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2>Education</h2>
            <div className="stack" style={{ marginTop: 16 }}>
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
        )}

        {about?.skills && about.skills.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2>Skills</h2>
            <div className="row" style={{ marginTop: 16 }}>
              {about.skills.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
