import React from "react";
import { render } from "@testing-library/react";

import Calendar from "./calendar";

it("renders the calendar", () => {
  const { container } = render(<Calendar />);

  expect(container).toHaveTextContent("Calendar");
});
