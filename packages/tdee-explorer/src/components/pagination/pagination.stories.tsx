import React from "react";
import Pagination from "./pagination";

export default {
  title: "Pagination",
  component: Pagination,
};

export const pagination = (args): JSX.Element => {
  return <Pagination {...args} />;
};

pagination.args = {
  urlRoot: "/foo",
  pageNumber: 2,
  pageInfo: { hasNextPage: true, hasPreviousPage: true },
};
