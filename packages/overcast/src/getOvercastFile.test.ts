import { loginToOvercast } from "./getOvercastFile";
import * as nock from "nock";

const rootUrl = "https://overcast.fm/";

test("successfully logs into overcast", async () => {
  nock(rootUrl)
    .post("/login", "then=podcasts&email=email%40email.com&password=password")
    .reply(302, undefined, { location: "podcasts" })
    .get("/podcasts")
    .reply(200);

  const loginSuccessful = await loginToOvercast("email@email.com", "password");

  expect(loginSuccessful).toBe(true);
});
