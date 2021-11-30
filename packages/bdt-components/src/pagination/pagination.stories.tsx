import React from "react";
import Pagination from "./pagination";

export default {
  title: "Components/Pagination",
  component: Pagination,
};

export const pagination = ({
  hasNextPage,
  hasPreviousPage,
  urlRoot,
  pageNumber,
}): JSX.Element => {
  return (
    <Pagination
      urlRoot={urlRoot}
      pageNumber={pageNumber}
      pageInfo={{ hasNextPage, hasPreviousPage }}
    />
  );
};

pagination.args = {
  urlRoot: "/foo",
  pageNumber: 2,
  hasNextPage: true,
  hasPreviousPage: true,
};
