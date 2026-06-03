import React from "react";
import type { WPPost } from "@tdee/types/src/bdt";

interface PostEntryProps {
  post: WPPost;
}

function postPath(post: WPPost): string {
  const d = new Date(post.date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `/${year}/${month}/${post.slug}/`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const PostEntry = ({ post }: PostEntryProps): JSX.Element => {
  return (
    <article className="stack compressed">
      <header>
        <h2>
          <a href={postPath(post)}>{post.title}</a>
        </h2>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </header>
      <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
    </article>
  );
};
