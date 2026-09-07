"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  async function handleLogout() {
    await fetch(`${API_URL}/api/logout`, { method: "POST", credentials: "include" });
    router.replace("/admin/login");
  }

  return (
    <div>
      <h1>Admin</h1>
      <p>
        <Link href="/admin/posts/new">New post</Link> &middot;{" "}
        <button onClick={handleLogout}>Log out</button>
      </p>

      {error && <p role="alert">{error}</p>}

      {posts === null ? (
        <p>Loading…</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.status}</td>
                <td>
                  <Link href={`/admin/posts/${post.id}`}>Edit</Link>{" "}
                  <button onClick={() => handleDelete(post.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
