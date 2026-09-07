import type { Metadata } from "next";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog",
};

interface PostSummary {
  id: string;
  slug: string;
  title: string;
  published_at: number;
}

async function getPosts(): Promise<PostSummary[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts;
  } catch {
    return [];
  }
}

function formatDate(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div className="section">
      <div className="container">
        <span className="eyebrow">Writing</span>
        <h1>Blog</h1>

        {posts.length === 0 ? (
          <p style={{ marginTop: 16 }}>No posts published yet.</p>
        ) : (
          <div className="stack" style={{ marginTop: 32 }}>
            {posts.map((post) => (
              <div key={post.id} className="post-list-item">
                <Link href={`/blog/${post.slug}`}>
                  <div className="post-meta">{formatDate(post.published_at)}</div>
                  <span className="post-list-title">{post.title}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
