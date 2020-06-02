import React from "react";
import { Link } from "gatsby";

type PageInfo = { hasNextPage?: boolean; hasPreviousPage?: boolean };

const Pagination = ({
  pageInfo,
  urlRoot,
  pageNumber = 1,
}: {
  pageInfo: PageInfo;
  urlRoot: string;
  pageNumber?: number;
}): JSX.Element => (
  <nav>
    {pageInfo.hasPreviousPage && (
      <Link to={`${urlRoot}/${pageNumber - 1}`}>&lt; Previous</Link>
    )}
    {pageInfo.hasNextPage && (
      <Link to={`${urlRoot}/${pageNumber + 1}`}>Next &gt;</Link>
    )}
  </nav>
);
export default Pagination;
