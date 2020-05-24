import React from "react";
import { render } from "@testing-library/react";
import Pagination from "../../components/pagination";

describe("Pagination component", () => {
  it("renders a next link", () => {
    const { getByText } = render(
      <Pagination pageInfo={{ hasNextPage: true }} />
    );
    expect(getByText(/Next/)).toBeVisible();
  });

  it("omits a next link when not required", () => {
    const { queryByText } = render(
      <Pagination pageInfo={{ hasNextPage: false }} />
    );
    expect(queryByText(/Next/)).toBeNull();
  });

  it("renders a previous link", () => {
    const { getByText } = render(
      <Pagination pageInfo={{ hasPreviousPage: true }} />
    );
    expect(getByText(/Previous/)).toBeVisible();
  });

  it("omits a next link when not required", () => {
    const { queryByText } = render(
      <Pagination pageInfo={{ hasPreviousPage: false }} />
    );
    expect(queryByText(/Previous/)).toBeNull();
  });
});
