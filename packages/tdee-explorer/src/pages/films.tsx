import React from "react";
import Centered from "../layouts/centered";
import Sidebar from "../layouts/sidebar";
import "../styles/global.css";
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
  <Centered>
    <Sidebar>
      <div className="logo">BreakfastDinnerTea</div>
      <main>
        <h1>Films I have watched recently</h1>

        {data.bdt.posts.nodes.map((film, i) => (
          <article className="kind-watch h-entry" key={`film-${i}`}>
            <header>
              <h2>
                Watched "{film.watchOf.name}" on{" "}
                <time className="dt-published" dateTime={film.date}>
                  {new Date(film.date).toDateString()}
                </time>
              </h2>
            </header>
            {film.watchOf.review && (
              <a href={film.watchOf.url}>
                I wrote some thoughts on it on Letterboxd
              </a>
            )}
          </article>
        ))}
      </main>
    </Sidebar>
  </Centered>
);

export default FilmsPage;
