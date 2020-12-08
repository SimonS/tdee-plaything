import generateRequest from "./generateRequest";

test("tests work", () => {
  expect(
    generateRequest({
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: "token",
      // eslint-disable-next-line @typescript-eslint/camelcase
      bdt_endpoint: "/endpoint",
      foo: "bar",
      car: 2,
    })
  ).toMatchObject({
    body: JSON.stringify({ foo: "bar", car: 2 }),
    authToken: "token",
    endpoint: "https://breakfastdinnertea.co.uk/endpoint",
  });
});
