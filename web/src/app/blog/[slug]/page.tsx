import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { API_URL } from "@/lib/api";

interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  published_at: number;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/api/posts/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.post;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  return { title: post?.title ?? "Post not found" };
}

// Posts are authored as plain text (no Markdown/rich-text editor yet — see
// Requirements Section 36), so paragraph breaks come from blank lines in the
// source text and wouldn't otherwise survive being rendered as HTML.
function renderContent(content: string) {
  return content
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph, i) => (
      <p key={i}>
        {paragraph.split("\n").map((line, j, lines) => (
          <span key={j}>
            {line}
            {j < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    ));
}

function formatDate(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="section">
      <div className="container">
        <article className="post-content" style={{ maxWidth: "68ch" }}>
          <div className="post-meta">{formatDate(post.published_at)}</div>
          <h1>{post.title}</h1>
          <div style={{ marginTop: 24 }}>{renderContent(post.content)}</div>
        </article>
      </div>
    </div>
  );
}
