import React from "react";
import { act, render } from "@testing-library/react";
import { films as filmsStore } from "../stores/films";
import Films from "./films";

describe("Films content", () => {
  beforeEach(() => filmsStore.set({ films: [] }));

  it("shows instructional text before selection", () => {
    const { container } = render(<Films />);
    expect(container).toHaveTextContent(
      "Click a date to show films watched that day"
    );
  });
});
