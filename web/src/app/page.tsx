import Link from "next/link";
import { API_URL } from "@/lib/api";

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
  const posts = await getRecentPosts();

  return (
    <div>
      <h1>Mujahid</h1>
      <p>
        Personal website and blog. Content for this page has not been
        finalized yet.
      </p>

      <section>
        <h2>Recent posts</h2>
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
      </section>
    </div>
  );
}
