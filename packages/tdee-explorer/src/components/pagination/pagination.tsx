import React from "react";
import { Link } from "gatsby";
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
      <Link to={`${urlRoot}/${pageNumber - 1}`}>&lt; Previous</Link>
    )}
    {pageInfo.hasNextPage && (
      <Link
        className={paginationStyles.next}
        to={`${urlRoot}/${pageNumber + 1}`}
      >
        Next &gt;
      </Link>
    )}
  </nav>
);
export default Pagination;
