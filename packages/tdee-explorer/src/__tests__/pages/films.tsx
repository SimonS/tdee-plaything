import React from "react";
import renderer from "react-test-renderer";
import { render } from "@testing-library/react";

import FilmsPage, { FilmWatch, GraphQLFilmQuery } from "../../pages/films";

describe("Films", () => {
  const data = {
    bdt: {
      posts: {
        nodes: [
          {
            date: "2020-05-20T22:18:04",
            watchOf: {
              name: "FILM",
              rating: 4,
              review: "REVIEW",
              url: "https://example.com/simonscarfe/film/21-jump-street/",
            },
          },
          {
            date: "2020-05-10T21:17:00",
            watchOf: {
              name: "A FILM I JUST WATCHED",
              rating: 3.5,
              review: null,
              url: "https://example.com/simonscarfe/film/thunder-road-2018/",
            },
          },
        ],
      },
    },
  };

  const filmWithReview = {
    date: "2020-05-20T22:18:04",
    watchOf: {
      name: "FILM",
      rating: 4,
      review: "REVIEW",
      url: "https://example.com/simonscarfe/film/21-jump-street/",
    },
  };

  const simpleWatch = {
    date: "2020-05-10T21:17:00",
    watchOf: {
      name: "A FILM I JUST WATCHED",
      rating: 3.5,
      review: null,
      url: "https://example.com/simonscarfe/film/thunder-road-2018/",
    },
  };

  const makeFilmResponse = (watches: FilmWatch[]): GraphQLFilmQuery => ({
    data: {
      bdt: {
        posts: {
          nodes: [...watches],
        },
      },
    },
  });

  it("renders correctly", () => {
    const { data } = makeFilmResponse([filmWithReview, simpleWatch]);
    const tree = renderer.create(<FilmsPage data={data} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("displays a review link if there is a review", () => {
    const { data } = makeFilmResponse([filmWithReview]);

    const { queryByText } = render(<FilmsPage data={data} />);
    expect(queryByText("I wrote some thoughts on Letterboxd")).toBeTruthy();
  });

  it("omits a review link if there is no review", () => {
    const { data } = makeFilmResponse([simpleWatch]);

    const { queryByText } = render(<FilmsPage data={data} />);
    expect(queryByText("I wrote some thoughts on Letterboxd")).toBeNull();
  });
});
