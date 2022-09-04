import React from "react";
import { Meta } from "@storybook/react";
import Films from "./films";
import { films as filmsStore } from "../stores/films";

export default {
  title: "Media/Films",
  component: Films,
  argTypes: {
    films: { control: "object" },
  },
} as Meta;

export const NoDateSelected = (): JSX.Element => {
  filmsStore.set({
    ...filmsStore.get(),
    films: [],
    selected: undefined,
  });
  return <Films />;
};
