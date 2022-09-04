import React from "react";
import { act, render } from "@testing-library/react";
import { films as filmsStore } from "../stores/films";
import Films from "./films";
import { Film } from "@tdee/types/src/bdt";

const mockFilms: Film[] = [
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
];

describe("Films content", () => {
  beforeEach(() => filmsStore.set({ films: [] }));

  it("shows instructional text before selection", () => {
    const { container } = render(<Films />);
    expect(container).toHaveTextContent(
      "Click a date to show films watched that day"
    );
  });

  it("removes default text when stores populated", () => {
    const { container } = render(<Films />);
    act(() =>
      filmsStore.set({
        ...filmsStore,
        films: [],
        selected: "2022-01-01",
      })
    );
    expect(container).not.toHaveTextContent(
      "Click a date to show films watched that day"
    );
  });

  it("displays contents of stores as films", () => {
    const { container } = render(<Films />);
    act(() =>
      filmsStore.set({
        ...filmsStore.get(),
        films: mockFilms,
        selected: "2022-01-01",
      })
    );
    expect(container).toHaveTextContent("Film #1");
    expect(container).toHaveTextContent("Film #2");
  });

  it("displays message when no films watched", () => {
    const { container } = render(<Films />);
    act(() =>
      filmsStore.set({
        ...filmsStore.get(),
        films: [],
        selected: "2022-01-01",
      })
    );
    expect(container).toHaveTextContent("No films watched");
  });

  it("displays current date", () => {
    const { container } = render(<Films />);
    act(() => filmsStore.set({ ...filmsStore.get(), selected: "2022-01-01" }));
    expect(container).toHaveTextContent("Date: Sat Jan 01 2022");
  });
});
