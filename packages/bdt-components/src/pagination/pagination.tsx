import React, { MouseEventHandler } from "react";
import * as paginationStyles from "./pagination.module.css";

type PageInfo = { hasNextPage?: boolean; hasPreviousPage?: boolean };

type CommonProps = {
  pageInfo: PageInfo;
  pageNumber?: number;
};

type LinkProps = CommonProps & {
  tag: "a";
  urlRoot: string;
};

type ButtonProps = CommonProps & {
  tag: "button";
  nextPageEvent: MouseEventHandler;
  previousPageEvent: MouseEventHandler;
};

const getLinks = ({ pageInfo, urlRoot, pageNumber = 1 }: LinkProps) => (
  <>
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
  </>
);

const getButtons = ({
  pageInfo,
  nextPageEvent,
  previousPageEvent,
}: ButtonProps) => (
  <>
    {pageInfo.hasPreviousPage && (
      <button onClick={previousPageEvent}>&lt;</button>
    )}
    {pageInfo.hasNextPage && (
      <button className={paginationStyles.next} onClick={nextPageEvent}>
        &gt;
      </button>
    )}
  </>
);

export const Pagination = (props: LinkProps | ButtonProps): JSX.Element => {
  return (
    <nav className={paginationStyles.pagination}>
      {props.tag === "a" ? getLinks(props) : getButtons(props)}
    </nav>
  );
};
export default Pagination;
