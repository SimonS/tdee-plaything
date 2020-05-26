import React from "react";
import { render } from "@testing-library/react";

import FilmsPage, { FilmWatch, GraphQLFilmQuery } from "../../pages/films";

describe("Films", () => {
  const filmWithReview = {
    date: "2020-05-20T22:18:04",
    watchOf: {
      name: "FILM",
      year: 2002,
      rating: 4,
      review: "REVIEW",
      url: "https://example.com/user/film/film/",
    },
  };

  const simpleWatch = {
    date: "2020-05-10T21:17:00",
    watchOf: {
      name: "A FILM I JUST WATCHED",
      year: 2001,
      rating: 3.5,
      review: null,
      url: "https://example.com/user/film/a-film-i-just-watched/",
      meta: {
        image: "foo.jpg",
      },
    },
  };

  const makeFilmResponse = (
    watches: FilmWatch[],
    hasPagination = false
  ): GraphQLFilmQuery => {
    const result: GraphQLFilmQuery = {
      data: {
        bdt: {
          posts: {
            nodes: [...watches],
          },
        },
      },
    };
    if (hasPagination) {
      result.data.bdt.posts.pageInfo = {
        hasNextPage: true,
        hasPreviousPage: false,
      };
    }
    return result;
  };

  it("displays the film name", () => {
    const { data } = makeFilmResponse([simpleWatch]);
    const { queryByText } = render(<FilmsPage data={data} />);

    expect(queryByText(/A FILM I JUST WATCHED/)).toBeTruthy();
  });

  it("renders the date in a human readable form", () => {
    const { data } = makeFilmResponse([simpleWatch]);
    const { getByText } = render(<FilmsPage data={data} />);

    expect(getByText("Viewed").nextElementSibling?.textContent).toEqual(
      "Sun May 10 2020"
    );
  });

  it("renders a rating out of 5", () => {
    const { data } = makeFilmResponse([simpleWatch]);
    const { getByText } = render(<FilmsPage data={data} />);

    expect(getByText("Rated").nextElementSibling?.textContent).toEqual("3.5/5");
  });

  it("links to letterboxd review when present", () => {
    const { data } = makeFilmResponse([filmWithReview]);

    const { getByText } = render(<FilmsPage data={data} />);
    expect(getByText(/on Letterboxd/).getAttribute("href")).toEqual(
      "https://example.com/user/film/film/"
    );
  });

  it("omits a review link if there is no review", () => {
    const { data } = makeFilmResponse([simpleWatch]);

    const { queryByText } = render(<FilmsPage data={data} />);
    expect(queryByText(/on Letterboxd/)).toBeNull();
  });

  it("displays a poster image when present", () => {
    const { data } = makeFilmResponse([simpleWatch]);

    const { getByAltText } = render(<FilmsPage data={data} />);
    expect(
      getByAltText("Poster for 'A FILM I JUST WATCHED'").getAttribute("src")
    ).toEqual("foo.jpg");
  });

  it("displays release year next to title", () => {
    const { data } = makeFilmResponse([simpleWatch]);

    const { queryByText } = render(<FilmsPage data={data} />);

    expect(queryByText(/A FILM I JUST WATCHED/)).toContainHTML("(2001)");
  });

  it("displays pagination when required", () => {
    const { data } = makeFilmResponse([simpleWatch], true);
    const { getByText } = render(<FilmsPage data={data} />);

    expect(getByText(/Next/)).toBeVisible();
  });
});
