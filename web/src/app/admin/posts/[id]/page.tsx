"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostForm, type PostFormValues } from "@/components/PostForm";
import { API_URL } from "@/lib/api";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<PostFormValues | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/posts/${params.id}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.post) setInitialValues(data.post);
      });
  }, [params.id]);

  async function handleSubmit(values: PostFormValues): Promise<string | void> {
    const res = await fetch(`${API_URL}/api/admin/posts/${params.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) return data.error ?? "Failed to save";
    router.replace("/admin");
  }

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`${API_URL}/api/admin/posts/${params.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    router.replace("/admin");
  }

  if (notFound) return <p>Post not found.</p>;
  if (!initialValues) return <p>Loading…</p>;

  return (
    <div>
      <h1>Edit Post</h1>
      <PostForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Save" />
      <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={handleDelete}>
        Delete post
      </button>
    </div>
  );
}
