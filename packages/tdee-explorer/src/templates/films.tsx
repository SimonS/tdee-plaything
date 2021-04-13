import React from "react";
import Layout from "../layouts/layout";

import Sidebar from "../layouts/sidebar";
import Stack from "../layouts/stack";

import { graphql } from "gatsby";
import Pagination from "../components/pagination/pagination";

export const query = graphql`
  query FilmsQuery($from: String, $first: Int) {
    bdt {
      films(
        where: { orderby: { field: DATE_WATCHED, order: DESC } }
        after: $from
        first: $first
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        nodes {
          watchedDate
          filmTitle
          year
          rating
          reviewLink
          content(format: RENDERED)
          meta {
            image
            runtime
            original_language
          }
        }
      }
    }
  }
`;

export interface FilmWatch {
  watchedDate: string;
  filmTitle: string;
  year: number;
  rating?: number;
  reviewLink?: string;
  content?: string | null;
  meta?: {
    image?: string;
    runtime?: number;
    original_language?: string;
  };
}

export interface GraphQLFilmQuery {
  bdt: {
    films: {
      nodes: FilmWatch[];
      pageInfo?: { hasNextPage: boolean; hasPreviousPage: boolean };
    };
  };
}

export interface FilmProps {
  data: GraphQLFilmQuery;
  pageContext?: { pageNumber: number };
  location?: { pathname: string };
}

const FilmsPage = ({ data, pageContext, location }: FilmProps): JSX.Element => (
  <Layout pathname={location?.pathname}>
    <h1>Films</h1>

    {data.bdt.films.nodes.map((film, i: number) => (
      <Sidebar as="article" key={`film-${i}`} side="right" sideWidth="154px">
        <Stack className="kind-watch h-entry">
          <header>
            <h2>
              {film.filmTitle} ({film.year})
            </h2>
          </header>
          <dl>
            <dt>Viewed</dt>
            <dd>
              <time className="dt-published" dateTime={film.watchedDate}>
                {new Date(film.watchedDate).toDateString()}
              </time>
            </dd>
            <dt>Rated</dt>
            <dd>{film.rating}/5</dd>
          </dl>
          {film.content && (
            <a href={film.reviewLink}>I wrote some thoughts on Letterboxd</a>
          )}
        </Stack>
        <img
          src={film.meta?.image}
          alt={`Poster for '${film.filmTitle}'`}
          className="poster-image"
        />
      </Sidebar>
    ))}

    {data.bdt.films.pageInfo && (
      <Pagination
        pageInfo={data.bdt.films.pageInfo}
        urlRoot="/films/page"
        pageNumber={pageContext?.pageNumber}
      />
    )}
  </Layout>
);

export default FilmsPage;
