import React from "react";
import * as paginationStyles from "./pagination.module.css";

type PageInfo = { hasNextPage?: boolean; hasPreviousPage?: boolean };

export const Pagination = ({
  pageInfo,
  urlRoot,
  pageNumber = 1,
}: {
  pageInfo: PageInfo;
  urlRoot: string;
  pageNumber?: number;
}): JSX.Element => (
  <nav className={paginationStyles.pagination}>
    {pageInfo.hasPreviousPage && (
      <a href={`${urlRoot}/${pageNumber - 1}`}>&lt; Previous</a>
    )}
    {pageInfo.hasNextPage && (
      <a
        className={paginationStyles.next}
        href={`${urlRoot}/${pageNumber + 1}`}
      >
        Next &gt;
      </a>
    )}
  </nav>
);
export default Pagination;
