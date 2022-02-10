import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Pagination from "./pagination";

describe("Pagination links", () => {
  it("renders a next link", () => {
    const { getByText } = render(
      <Pagination
        tag={`a`}
        pageInfo={{ hasNextPage: true }}
        urlRoot="/foo/page"
      />
    );
    expect(getByText(/Next/)).toBeVisible();
  });

  it("omits a next link when not required", () => {
    const { queryByText } = render(
      <Pagination
        tag={`a`}
        pageInfo={{ hasNextPage: false }}
        urlRoot="/foo/page"
      />
    );
    expect(queryByText(/Next/)).toBeNull();
  });

  it("renders a previous link", () => {
    const { getByText } = render(
      <Pagination
        tag={`a`}
        pageInfo={{ hasPreviousPage: true }}
        urlRoot="/foo/page"
      />
    );
    expect(getByText(/Previous/)).toBeVisible();
  });

  it("omits a next link when not required", () => {
    const { queryByText } = render(
      <Pagination
        tag={`a`}
        pageInfo={{ hasPreviousPage: false }}
        urlRoot="/foo/page"
      />
    );
    expect(queryByText(/Previous/)).toBeNull();
  });

  it("creates the correct next link", () => {
    const { getByText } = render(
      <Pagination
        tag={`a`}
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
        tag={`a`}
        pageInfo={{ hasPreviousPage: true }}
        urlRoot="/foo/page"
        pageNumber={2}
      />
    );
    expect(getByText(/Previous/)).toHaveAttribute("href", "/foo/page/1");
  });
});

describe("Pagination buttons", () => {
  const previousPageEvent = jest.fn();
  const nextPageEvent = jest.fn();
  const { getAllByRole } = render(
    <Pagination
      pageInfo={{ hasPreviousPage: true, hasNextPage: true }}
      tag={`button`}
      previousPageEvent={previousPageEvent}
      nextPageEvent={nextPageEvent}
    />
  );
  expect(getAllByRole("button")).toHaveLength(2);
  fireEvent.click(getAllByRole("button")[0]);
  fireEvent.click(getAllByRole("button")[1]);

  expect(previousPageEvent).toHaveBeenCalled();
  expect(nextPageEvent).toHaveBeenCalled();
});
