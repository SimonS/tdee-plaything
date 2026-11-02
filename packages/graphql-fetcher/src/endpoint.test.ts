// The endpoint is read once, at import, so each test imports a fresh copy.
const loadEndpoint = async (): Promise<string> => {
  let endpoint = "";
  await jest.isolateModulesAsync(async () => {
    endpoint = (await import("./endpoint")).default;
  });
  return endpoint;
};

afterEach(() => {
  delete process.env.BDT_GRAPHQL_URL;
});

test("defaults to the live site", async () => {
  expect(await loadEndpoint()).toBe("https://breakfastdinnertea.co.uk/graphql");
});

test("can be pointed at another site with BDT_GRAPHQL_URL", async () => {
  process.env.BDT_GRAPHQL_URL = "http://localhost:8080/graphql";

  expect(await loadEndpoint()).toBe("http://localhost:8080/graphql");
});
