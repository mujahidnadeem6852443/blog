import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogIndexPage() {
  // TODO: fetch published posts from the API once the backend/database exist.
  return (
    <div>
      <h1>Blog</h1>
      <p>No posts published yet.</p>
    </div>
  );
}
