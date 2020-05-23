import React from "react";
import Layout from "../layouts/layout";

import Sidebar from "../layouts/sidebar";
import Stack from "../layouts/stack";

import { graphql } from "gatsby";

export const query = graphql`
  query FilmsQuery {
    bdt {
      posts(where: { tag: "film" }) {
        nodes {
          date
          watchOf {
            name
            year
            rating
            review
            url
            meta {
              image
            }
          }
        }
      }
    }
  }
`;

export interface FilmWatch {
  date: string;
  watchOf: {
    name: string;
    year: number;
    rating?: number;
    review?: string | null;
    url?: string;
    meta?: {
      image?: string;
    };
  };
}

export interface GraphQLFilmQuery {
  data: {
    bdt: {
      posts: {
        nodes: FilmWatch[];
      };
    };
  };
}

const FilmsPage = ({ data }: GraphQLFilmQuery): JSX.Element => (
  <Layout>
    <h1>Films</h1>

    {data.bdt.posts.nodes.map((film, i: number) => (
      <Sidebar as="article" key={`film-${i}`} side="right" sideWidth="154px">
        <Stack className="kind-watch h-entry">
          <header>
            <h2>
              {film.watchOf.name} ({film.watchOf.year})
            </h2>
          </header>
          <dl>
            <dt>Viewed</dt>
            <dd>
              <time className="dt-published" dateTime={film.date}>
                {new Date(film.date).toDateString()}
              </time>
            </dd>
            <dt>Rated</dt>
            <dd>{film.watchOf.rating}/5</dd>
          </dl>
          {film.watchOf.review && (
            <a href={film.watchOf.url}>I wrote some thoughts on Letterboxd</a>
          )}
        </Stack>
        <img
          src={film.watchOf.meta?.image}
          alt={`Poster for '${film.watchOf.name}'`}
          className="poster-image"
        />
      </Sidebar>
    ))}
  </Layout>
);

export default FilmsPage;
