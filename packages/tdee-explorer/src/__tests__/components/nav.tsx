import React from "react";
import { render } from "@testing-library/react";
import Nav from "../../components/nav";

describe("Nav component", () => {
  it("displays some links that link to the right place", () => {
    const { getByText } = render(<Nav />);
    expect(getByText("Home")).toHaveAttribute("href", "/");
  });

  it("highlights current page", () => {
    const { getByText } = render(<Nav url="/films" />);
    expect(getByText(/Films/)).toHaveClass("current");
  });

  it("highlights parent pages", () => {
    const { getByText } = render(<Nav url="/films/foo" />);
    expect(getByText(/Films/)).toHaveClass("current");
  });
});
