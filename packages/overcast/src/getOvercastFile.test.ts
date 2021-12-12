import { addit } from "./getOvercastFile";

test("hooked up correctly", async () => {
  expect(addit()).toEqual(4);
});
