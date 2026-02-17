import generateRequest from "./generateRequest";

test("tests work", () => {
  expect(
    generateRequest({
      access_token: "token",
      bdt_endpoint: "/endpoint",
      foo: "bar",
      car: 2,
    }),
  ).toMatchObject({
    body: JSON.stringify({ foo: "bar", car: 2 }),
    authToken: "token",
    endpoint: "https://breakfastdinnertea.co.uk/endpoint",
  });
});
