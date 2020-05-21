import React from "react";
import Layout from "../layouts/layout";

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
            rating
            review
            url
          }
        }
      }
    }
  }
`;

const FilmsPage = ({ data }): JSX.Element => (
  <Layout>
    <h1>Films</h1>

    {data.bdt.posts.nodes.map((film, i) => (
      <Stack as="article" className="kind-watch h-entry" key={`film-${i}`}>
        <header>
          <h2>{film.watchOf.name}</h2>
        </header>
        <dl>
          <dt>Viewed</dt>
          <dd>
            <time className="dt-published" dateTime={film.date}>
              {new Date(film.date).toDateString()}
            </time>
          </dd>
          <dt>Rated</dt>
          <dd>{film.watchOf.rating}</dd>
        </dl>
        {film.watchOf.review && (
          <a href={film.watchOf.url}>
            I wrote some thoughts on it on Letterboxd
          </a>
        )}
      </Stack>
    ))}
  </Layout>
);

export default FilmsPage;
