import Link from "next/link";
import { API_URL } from "@/lib/api";
import { getPageContent } from "@/lib/content";

interface PostSummary {
  id: string;
  slug: string;
  title: string;
  published_at: number;
}

async function getRecentPosts(): Promise<PostSummary[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts.slice(0, 5);
  } catch {
    return [];
  }
}

export default async function Home() {
  const [home, posts] = await Promise.all([getPageContent("home"), getRecentPosts()]);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">{home?.title ?? "Personal website"}</span>
          <h1>{home?.name ?? "Mujahid"}</h1>
          {home?.tagline && <p className="lede" style={{ marginTop: 12 }}>{home.tagline}</p>}
          {home?.bio && (
            <p className="muted" style={{ marginTop: 16, maxWidth: "60ch" }}>
              {home.bio}
            </p>
          )}
          <div className="row hero-actions">
            <Link href="/resume" className="btn btn-primary">
              View Resume
            </Link>
            <Link href="/projects" className="btn btn-secondary">
              See Projects
            </Link>
            <Link href="/blog" className="btn btn-secondary">
              Read the Blog
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header row" style={{ justifyContent: "space-between" }}>
            <h2>Recent posts</h2>
            <Link href="/blog" className="muted">
              View all &rarr;
            </Link>
          </div>
          {posts.length === 0 ? (
            <p>No posts published yet.</p>
          ) : (
            <div className="stack">
              {posts.map((post) => (
                <div key={post.id} className="post-list-item">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="post-list-title">{post.title}</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
