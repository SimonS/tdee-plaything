import React from "react";
import { withKnobs, boolean, number } from "@storybook/addon-knobs";
import Pagination from "./pagination";

export default {
  title: "Pagination",
  component: Pagination,
  decorators: [withKnobs],
};

export const pagination = (): JSX.Element => {
  return (
    <Pagination
      pageInfo={{
        hasNextPage: boolean("hasNextPage", true),
        hasPreviousPage: boolean("hasPreviousPage", true),
      }}
      urlRoot="/foo"
      pageNumber={number("pageNumber", 2)}
    />
  );
};
