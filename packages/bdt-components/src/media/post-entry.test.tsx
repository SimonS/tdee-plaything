import React from "react";
import { render, screen } from "@testing-library/react";
import { PostEntry } from "./post-entry";
import type { WPPost } from "@tdee/types/src/bdt";

const mockPost: WPPost = {
  id: "cG9zdDoxMjM=",
  title: "Jinteki.net Plugin: Jankteki",
  slug: "jinteki-net-plugin-jankteki",
  date: "2016-02-15T10:00:00",
  excerpt: "<p>A post about the Jinteki.net plugin.</p>",
  content: "<p>Full content here.</p>",
  tags: {
    nodes: [
      { name: "Netrunner", slug: "netrunner" },
      { name: "Plugin", slug: "plugin" },
    ],
  },
  categories: { nodes: [{ name: "Tech", slug: "tech" }] },
};

test("renders the post title as a link", () => {
  render(<PostEntry post={mockPost} />);
  const link = screen.getByRole("link", { name: mockPost.title });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute(
    "href",
    "/blog/2016/02/jinteki-net-plugin-jankteki/",
  );
});

test("renders the post date", () => {
  render(<PostEntry post={mockPost} />);
  expect(screen.getByText(/15 February 2016/i)).toBeInTheDocument();
});

test("renders the excerpt as HTML", () => {
  render(<PostEntry post={mockPost} />);
  expect(
    screen.getByText("A post about the Jinteki.net plugin."),
  ).toBeInTheDocument();
});

test("renders category links", () => {
  render(<PostEntry post={mockPost} />);
  const link = screen.getByRole("link", { name: "Tech" });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute("href", "/blog/category/tech/");
});

test("renders tag links", () => {
  render(<PostEntry post={mockPost} />);
  const netrunnerLink = screen.getByRole("link", { name: "Netrunner" });
  expect(netrunnerLink).toBeInTheDocument();
  expect(netrunnerLink).toHaveAttribute("href", "/blog/tag/netrunner/");
  const pluginLink = screen.getByRole("link", { name: "Plugin" });
  expect(pluginLink).toHaveAttribute("href", "/blog/tag/plugin/");
});

test("renders no category links when post has no categories", () => {
  render(<PostEntry post={{ ...mockPost, categories: { nodes: [] } }} />);
  expect(screen.queryByRole("link", { name: "Tech" })).not.toBeInTheDocument();
});

test("renders no tag links when post has no tags", () => {
  render(<PostEntry post={{ ...mockPost, tags: { nodes: [] } }} />);
  expect(
    screen.queryByRole("link", { name: "Netrunner" }),
  ).not.toBeInTheDocument();
});

test("renders category links even when post has no tags", () => {
  render(<PostEntry post={{ ...mockPost, tags: { nodes: [] } }} />);
  expect(screen.getByRole("link", { name: "Tech" })).toBeInTheDocument();
});

test("renders tag links even when post has no categories", () => {
  render(<PostEntry post={{ ...mockPost, categories: { nodes: [] } }} />);
  expect(screen.getByRole("link", { name: "Netrunner" })).toBeInTheDocument();
});
