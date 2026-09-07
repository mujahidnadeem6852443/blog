"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

interface PostSummary {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  updated_at: number;
}

export default function AdminDashboardPage() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadPosts() {
    const res = await fetch(`${API_URL}/api/admin/posts`, { credentials: "include" });
    if (!res.ok) {
      setError("Failed to load posts");
      return;
    }
    const data = await res.json();
    setPosts(data.posts);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`${API_URL}/api/admin/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    loadPosts();
  }

  return (
    <div>
      <h1>Posts</h1>
      <p>
        <Link href="/admin/posts/new" className="btn btn-primary" style={{ marginTop: 12 }}>
          New post
        </Link>
      </p>

      {error && <p role="alert">{error}</p>}

      {posts === null ? (
        <p>Loading…</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="stack" style={{ marginTop: 20 }}>
          {posts.map((post) => (
            <div key={post.id} className="card row" style={{ justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{post.title}</div>
                <span className="chip" style={{ marginTop: 6 }}>
                  {post.status}
                </span>
              </div>
              <div className="row">
                <Link href={`/admin/posts/${post.id}`} className="btn btn-secondary">
                  Edit
                </Link>
                <button className="btn btn-secondary" onClick={() => handleDelete(post.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
