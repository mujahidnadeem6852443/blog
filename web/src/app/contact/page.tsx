import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const contact = await getPageContent("contact");

  if (!contact) {
    return (
      <div className="container section">
        <h1>Contact</h1>
        <p>Content for this page has not been finalized yet.</p>
      </div>
    );
  }

  const links = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "LinkedIn", value: "Connect on LinkedIn", href: contact.linkedin },
    { label: "GitHub", value: "View on GitHub", href: contact.github },
  ];

  return (
    <div className="section">
      <div className="container">
        <span className="eyebrow">Get in touch</span>
        <h1>Contact</h1>
        <p className="lede" style={{ marginTop: 16 }}>
          Reach out through any of the channels below.
        </p>

        <div className="grid grid-auto" style={{ marginTop: 32 }}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="card-link"
            >
              <div className="card">
                <div className="eyebrow">{link.label}</div>
                <div style={{ fontWeight: 700 }}>{link.value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
