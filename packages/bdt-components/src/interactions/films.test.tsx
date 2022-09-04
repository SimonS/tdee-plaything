import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { films } from "../stores/films";
import FilmCalendar from "./films";
import { GroupedFilms } from "@tdee/types/src/bdt";

const grouped: GroupedFilms = {
  "2022-01-01": [
    {
      watchedDate: "2022-01-01",
      content: "content",
      filmTitle: "Film #1",
      year: 2021,
      rating: 3,
      reviewLink: "",
      meta: {
        image: "",
        runtime: 90,
        original_language: "en",
      },
    },
    {
      watchedDate: "2022-01-01",
      content: "content",
      filmTitle: "Film #2",
      year: 2020,
      rating: 2,
      reviewLink: "",
      meta: {
        image: "",
        runtime: 90,
        original_language: "en",
      },
    },
  ],
};

it("renders the interaction", () => {
  const { container } = render(
    <FilmCalendar
      aggregated={[{ day: "2022-01-01", value: 2 }]}
      grouped={{}}
      responsive={false}
    />
  );

  expect(container).toHaveTextContent("Jun");
});

it("populates state store with podcast list", () => {
  const { container } = render(
    <FilmCalendar
      aggregated={[{ day: "2022-01-01", value: 2 }]}
      grouped={grouped}
      responsive={false}
    />
  );

  const firstDate = container.querySelector("g rect");

  if (firstDate) fireEvent.click(firstDate);

  const { films: storeContents } = films.get();
  expect(storeContents).toHaveLength(2);
  expect(storeContents[0].filmTitle).toEqual("Film #1");
});

it("populates state store with selected date", () => {
  const { container } = render(
    <FilmCalendar
      aggregated={[{ day: "2022-01-01", value: 2 }]}
      grouped={grouped}
      responsive={false}
    />
  );

  const firstDate = container.querySelector("g rect");

  if (firstDate) fireEvent.click(firstDate);

  const { selected } = films.get();
  expect(selected).toEqual("2022-01-01");
});
