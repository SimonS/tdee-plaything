import { isInternalLink } from "./main";

test("should return false given external link", () => {
  expect(isInternalLink("https://google.com")).toBe(false);
});

test("should return true given internal link", () => {
  expect(isInternalLink("/some-page")).toBe(true);
});
