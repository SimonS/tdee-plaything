import React from "react";
import Pagination from "./pagination";
import { action } from "@storybook/addon-actions";

export default {
  title: "Components/Pagination",
  component: Pagination,
};

export const paginationLinks = ({
  hasNextPage,
  hasPreviousPage,
  urlRoot,
  pageNumber,
}: {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  urlRoot: string;
  pageNumber: number;
}): JSX.Element => {
  return (
    <Pagination
      tag={`a`}
      urlRoot={urlRoot}
      pageNumber={pageNumber}
      pageInfo={{ hasNextPage, hasPreviousPage }}
    />
  );
};

paginationLinks.args = {
  urlRoot: "/foo",
  pageNumber: 2,
  hasNextPage: true,
  hasPreviousPage: true,
};

export const paginationButtons = ({
  hasNextPage,
  hasPreviousPage,
}: {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}): JSX.Element => {
  return (
    <Pagination
      tag={`button`}
      pageInfo={{ hasNextPage, hasPreviousPage }}
      nextPageEvent={action("next")}
      previousPageEvent={action("previous")}
    />
  );
};

paginationButtons.args = {
  hasNextPage: true,
  hasPreviousPage: true,
};
