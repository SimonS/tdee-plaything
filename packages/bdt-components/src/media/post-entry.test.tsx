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
};

test("renders the post title as a link", () => {
  render(<PostEntry post={mockPost} />);
  const link = screen.getByRole("link", { name: mockPost.title });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute("href", "/2016/02/jinteki-net-plugin-jankteki/");
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
