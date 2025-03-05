// import 'web-streams-polyfill/ponyfill';

import { loginToOvercast, getOvercastListens } from "./getOvercastListens";
import * as nock from "nock";
import { readFileSync } from "fs";
import * as path from "path";

const rootUrl = "https://overcast.fm/";

const setupLogin = async () => {
  nock(rootUrl)
    .post("/login", "then=podcasts&email=email%40email.com&password=password")
    .reply(302, undefined, { location: "podcasts" })
    .get("/podcasts")
    .reply(200);

  return await loginToOvercast("email@email.com", "password");
};

const setupOPML = (fixture: string) => {
  const latestOPML = readFileSync(
    path.join(__dirname, `../__FIXTURES__/${fixture}.xml`)
  );

  nock(rootUrl).get("/account/export_opml/extended").reply(200, latestOPML);
};

test("successfully logs into overcast", async () => {
  const loginSuccessful = await setupLogin();

  expect(loginSuccessful).toBe(true);
});

test("returns an empty array when no new listens", async () => {
  await setupLogin();
  setupOPML("no-listens");

  const result = await getOvercastListens();

  expect(result).toEqual([]);
});

test("takes a since parameter and returns only results since after then", async () => {
  await setupLogin();
  setupOPML("listens");

  const result = await getOvercastListens(new Date("2021-12-10T00:00:00"));

  expect(result).toHaveLength(1);
  expect(result).toEqual([
    {
      pubDate: new Date("2021-05-19T08:00:00-04:00"),
      title:
        "ML173: Dean Nelson on Interviewing Like a Pro, Confronting Career Crisis and Talking to Your Heroes",
      url: "https://metalearn.libsyn.com/ml174-dean-nelson-on-interviewing-like-a-pro-confronting-career-crisis",
      overcastUrl: "https://overcast.fm/+GdL6nZx1Y",
      sourceUrl:
        "https://traffic.libsyn.com/secure/metalearn/ML173__Dean_Nelson_on_Interviewing_Like_a_Pro_Confronting_Career_Crisis_and_Talking_to_Your_Heroes.mp3?dest-id=351957",
      userUpdatedDate: new Date("2021-12-10T17:33:09-05:00"),
      feedUrl: "https://metalearn.libsyn.com/rss",
    },
  ]);
});

test("returns an array of listened tracks", async () => {
  await setupLogin();
  setupOPML("listens");

  const result = await getOvercastListens();

  expect(result).toHaveLength(2);
  expect(result).toEqual([
    {
      pubDate: new Date("2021-02-18T07:00:00-05:00"),
      title: "Ep. 72: Habit Tune-Up: Excessive Planning Syndrome",
      url: "",
      overcastUrl: "https://overcast.fm/+b1V0WLux0",
      sourceUrl:
        "https://www.buzzsprout.com/1121972/7901239-ep-72-habit-tune-up-excessive-planning-syndrome.mp3",
      userUpdatedDate: new Date("2021-09-05T09:51:05-04:00"),
      feedUrl: "https://feeds.buzzsprout.com/1121972.rss",
    },
    {
      pubDate: new Date("2021-05-19T08:00:00-04:00"),
      title:
        "ML173: Dean Nelson on Interviewing Like a Pro, Confronting Career Crisis and Talking to Your Heroes",
      url: "https://metalearn.libsyn.com/ml174-dean-nelson-on-interviewing-like-a-pro-confronting-career-crisis",
      overcastUrl: "https://overcast.fm/+GdL6nZx1Y",
      sourceUrl:
        "https://traffic.libsyn.com/secure/metalearn/ML173__Dean_Nelson_on_Interviewing_Like_a_Pro_Confronting_Career_Crisis_and_Talking_to_Your_Heroes.mp3?dest-id=351957",
      userUpdatedDate: new Date("2021-12-10T17:33:09-05:00"),
      feedUrl: "https://metalearn.libsyn.com/rss",
    },
  ]);
});
