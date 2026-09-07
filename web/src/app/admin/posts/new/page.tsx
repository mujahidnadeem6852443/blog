"use client";

import { useRouter } from "next/navigation";
import { PostForm, type PostFormValues } from "@/components/PostForm";
import { API_URL } from "@/lib/api";

export default function NewPostPage() {
  const router = useRouter();

  async function handleSubmit(values: PostFormValues): Promise<string | void> {
    const res = await fetch(`${API_URL}/api/admin/posts`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) return data.error ?? "Failed to save";
    router.replace("/admin");
  }

  return (
    <div>
      <h1>New Post</h1>
      <PostForm
        initialValues={{ title: "", slug: "", content: "", status: "draft" }}
        onSubmit={handleSubmit}
        submitLabel="Create"
      />
    </div>
  );
}
