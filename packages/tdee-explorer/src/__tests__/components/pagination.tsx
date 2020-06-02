import React from "react";
import { render } from "@testing-library/react";
import Pagination from "../../components/pagination";

describe("Pagination component", () => {
  it("renders a next link", () => {
    const { getByText } = render(
      <Pagination pageInfo={{ hasNextPage: true }} urlRoot="/foo/page" />
    );
    expect(getByText(/Next/)).toBeVisible();
  });

  it("omits a next link when not required", () => {
    const { queryByText } = render(
      <Pagination pageInfo={{ hasNextPage: false }} urlRoot="/foo/page" />
    );
    expect(queryByText(/Next/)).toBeNull();
  });

  it("renders a previous link", () => {
    const { getByText } = render(
      <Pagination pageInfo={{ hasPreviousPage: true }} urlRoot="/foo/page" />
    );
    expect(getByText(/Previous/)).toBeVisible();
  });

  it("omits a next link when not required", () => {
    const { queryByText } = render(
      <Pagination pageInfo={{ hasPreviousPage: false }} urlRoot="/foo/page" />
    );
    expect(queryByText(/Previous/)).toBeNull();
  });

  it("creates the correct next link", () => {
    const { getByText } = render(
      <Pagination
        pageInfo={{ hasNextPage: true }}
        urlRoot="/foo/page"
        pageNumber={1}
      />
    );
    expect(getByText(/Next/)).toHaveAttribute("href", "/foo/page/2");
  });

  it("creates the correct previous link", () => {
    const { getByText } = render(
      <Pagination
        pageInfo={{ hasPreviousPage: true }}
        urlRoot="/foo/page"
        pageNumber={2}
      />
    );
    expect(getByText(/Previous/)).toHaveAttribute("href", "/foo/page/1");
  });
});
