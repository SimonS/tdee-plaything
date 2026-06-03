import React from "react";
import type { WPPost, WPTaxonomyTerm } from "@tdee/types/src/bdt";

interface PostEntryProps {
  post: WPPost;
}

function postPath(post: WPPost): string {
  const d = new Date(post.date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `/blog/${year}/${month}/${post.slug}/`;
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
      {post.categories.nodes.length > 0 && (
        <ul className="categories">
          {post.categories.nodes.map((cat: WPTaxonomyTerm) => (
            <li key={cat.slug}>
              <a href={`/blog/category/${cat.slug}/`}>{cat.name}</a>
            </li>
          ))}
        </ul>
      )}
      {post.tags.nodes.length > 0 && (
        <ul className="tags">
          {post.tags.nodes.map((tag: WPTaxonomyTerm) => (
            <li key={tag.slug}>
              <a href={`/blog/tag/${tag.slug}/`}>{tag.name}</a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};
