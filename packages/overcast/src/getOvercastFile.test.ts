import { getOvercastFile, loginToOvercast } from "./getOvercastFile";
import { readFileSync } from "fs";
import * as nock from "nock";
import * as mockFS from "mock-fs";

const rootUrl = "https://overcast.fm/";

const setupLogin = async () => {
  nock(rootUrl)
    .post("/login", "then=podcasts&email=email%40email.com&password=password")
    .reply(302, undefined, { location: "podcasts" })
    .get("/podcasts")
    .reply(200);

  return await loginToOvercast("email@email.com", "password");
};

test("successfully logs into overcast", async () => {
  const loginSuccessful = await setupLogin();

  expect(loginSuccessful).toBe(true);
});

test("downloads opml into a temporary area", async () => {
  const latestOPML = "new file contents";
  mockFS({ "/tmp/extended.opml": "old file contents" });

  await setupLogin();

  nock(rootUrl).get("/account/export_opml/extended").reply(200, latestOPML);

  await getOvercastFile();

  const result = readFileSync("/tmp/extended.opml", "utf-8");
  expect(result).toEqual(latestOPML);

  mockFS.restore();
});
