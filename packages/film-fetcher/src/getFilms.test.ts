import getFilms from "./getFilms";

test("check it all works", async () => {
  const res = await getFilms();

  expect(res).toEqual("films");
});
