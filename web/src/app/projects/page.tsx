import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const projects = await getPageContent("projects");

  return (
    <div className="section">
      <div className="container">
        <span className="eyebrow">Work</span>
        <h1>Projects</h1>

        {!projects || projects.items.length === 0 ? (
          <p style={{ marginTop: 16 }}>Content for this page has not been finalized yet.</p>
        ) : (
          <div className="grid grid-auto" style={{ marginTop: 32 }}>
            {projects.items.map((project) => (
              <a
                key={project.title}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="card-link"
              >
                <div className="card" style={{ height: "100%" }}>
                  <div className="pillar-title">{project.title}</div>
                  <p>{project.description}</p>
                  <span className="muted" style={{ display: "inline-block", marginTop: 12 }}>
                    View on GitHub &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
