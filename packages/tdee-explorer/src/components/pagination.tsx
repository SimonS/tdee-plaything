import React from "react";
import { Link } from "gatsby";

type PageInfo = { hasNextPage?: boolean; hasPreviousPage?: boolean };

const Pagination = ({ pageInfo }: { pageInfo: PageInfo }): JSX.Element => (
  <nav>
    {pageInfo.hasPreviousPage ? <Link to="/">&lt; Previous</Link> : null}
    {pageInfo.hasNextPage ? <Link to="/">Next &gt;</Link> : null}
  </nav>
);
export default Pagination;
