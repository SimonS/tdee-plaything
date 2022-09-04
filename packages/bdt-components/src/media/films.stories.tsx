import React from "react";
import { Meta } from "@storybook/react";
import Films from "./films";
import { films as filmsStore } from "../stores/films";
import { Film } from "@tdee/types/src/bdt";

export default {
  title: "Media/Films",
  component: Films,
  argTypes: {
    films: { control: "object" },
  },
} as Meta;

export const DefaultFilms = ({
  films,
  selected,
}: {
  films: Film[];
  selected?: string;
}): JSX.Element => {
  filmsStore.set({
    ...filmsStore.get(),
    films,
    selected,
  });
  return <Films />;
};

export const NoDateSelected = (): JSX.Element => {
  filmsStore.set({
    ...filmsStore.get(),
    films: [],
    selected: undefined,
  });
  return <Films />;
};

export const NoFilmsWatched = (): JSX.Element => {
  filmsStore.set({
    ...filmsStore.get(),
    films: [],
    selected: "2022-01-01",
  });
  return <Films />;
};

DefaultFilms.args = {
  selected: "2022-01-01",
  films: [
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
      reviewLink: "fdsfd",
      meta: {
        image: "",
        runtime: 90,
        original_language: "en",
      },
    },
  ],
};
