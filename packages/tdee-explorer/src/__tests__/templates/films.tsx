import React from "react";
import { render } from "@testing-library/react";

import FilmsPage, { FilmWatch, FilmProps } from "../../templates/films";

describe("Films", () => {
  const filmWithReview: FilmWatch = {
    watchedDate: "2020-05-20T22:18:04",
    filmTitle: "FILM",
    year: 2002,
    rating: 4,
    content: "REVIEW",
    reviewLink: "https://example.com/user/film/film/",
  };

  const simpleWatch: FilmWatch = {
    watchedDate: "2020-05-10T21:17:00",
    filmTitle: "A FILM I JUST WATCHED",
    year: 2001,
    rating: 3.5,
    content: null,
    reviewLink: "https://example.com/user/film/a-film-i-just-watched/",
    meta: {
      image: "foo.jpg",
    },
  };

  const makeFilmResponse = (
    watches: FilmWatch[],
    hasPagination = false,
    pageNumber?: number
  ): FilmProps => {
    const result: FilmProps = {
      data: {
        bdt: {
          films: {
            nodes: [...watches],
          },
        },
      },
    };
    if (hasPagination) {
      result.data.bdt.films.pageInfo = {
        hasNextPage: true,
        hasPreviousPage: false,
      };
    }

    if (pageNumber) {
      result.pageContext = { pageNumber };
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

  it("sends the pageNumber through when available", () => {
    const { data, pageContext } = makeFilmResponse([simpleWatch], true, 1);
    const { getByText } = render(<FilmsPage data={data} {...pageContext} />);

    expect(getByText(/Next/)).toHaveAttribute("href", "/films/page/2");
  });
});
