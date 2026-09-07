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

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Blog</h1>
      {posts.length === 0 ? (
        <p>No posts published yet.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
