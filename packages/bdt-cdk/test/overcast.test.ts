import * as overcast from "@tdee/overcast-functions/src/getOvercastListens";
import { handler } from "../lambda/overcast";
import axios from "axios";

afterEach(() => {
  jest.restoreAllMocks();
});

const mockLogin = (successful: boolean) =>
  jest
    .spyOn(overcast, "loginToOvercast")
    .mockImplementation(async () => successful);

const mockListens = (listens: overcast.OvercastListen[]) =>
  jest
    .spyOn(overcast, "getOvercastListens")
    .mockImplementation(async () => listens);

const mockAxios = () =>
  jest.spyOn(axios, "post").mockImplementation(async () => {});

test("login failed", async () => {
  mockLogin(false);

  const result = await handler({
    email: "someemail@gmail.com",
    password: "mypassword",
  });

  expect(result.statusCode).toEqual(401);
});

test("login successful", async () => {
  mockLogin(true);
  mockListens([]);
  mockAxios();

  const result = await handler({
    email: "someemail@gmail.com",
    password: "mypassword",
  });

  expect(result.statusCode).toEqual(200);
});

test("login uses credentials from environment variables when credentials not passed", async () => {
  const loginSpy = jest
    .spyOn(overcast, "loginToOvercast")
    .mockImplementation(async (email?: string, password?: string) => false);

  mockAxios();

  const email = "email@email.com";
  const pw = "password";

  process.env.OVERCAST_EMAIL = email;
  process.env.OVERCAST_PASSWORD = pw;

  await handler({});

  expect(loginSpy).toHaveBeenCalledWith(email, pw);
});

test("calls listen getter with yesterday's date", async () => {
  const mockDate = new Date("2020-01-02");
  const dateMock = jest
    .spyOn(global, "Date")
    .mockImplementation(() => mockDate as unknown as string);

  mockLogin(true);
  mockAxios();
  const listenSpy = mockListens([]);

  await handler({
    email: "someemail@gmail.com",
    password: "mypassword",
  });

  expect(listenSpy).toHaveBeenCalledWith(new Date("2020-01-01"));
});

test("posts listens to wordpress", async () => {
  mockLogin(true);

  const listens = [
    {
      pubDate: new Date("2021-02-18T07:00:00-05:00"),
      title: "Ep. 72: Habit Tune-Up: Excessive Planning Syndrome",
      url: "https://url",
      overcastUrl: "https://overcast.fm/+b1V0WLux0",
      sourceUrl:
        "https://www.buzzsprout.com/1121972/7901239-ep-72-habit-tune-up-excessive-planning-syndrome.mp3",
      userUpdatedDate: new Date("2021-09-05T09:51:05-04:00"),
      feedUrl: "https://feeds.buzzsprout.com/1121972.rss",
    },
  ];

  mockListens(listens);
  process.env.BDT_AUTH_TOKEN = "token";

  const axiosSpy = mockAxios();

  await handler({
    email: "someemail@gmail.com",
    password: "mypassword",
  });

  expect(axiosSpy).toHaveBeenCalledWith(
    "https://breakfastdinnertea.co.uk/wp-json/wp/v2/bdt_podcast_listen",
    {
      meta: {
        podcast_title: "Ep. 72: Habit Tune-Up: Excessive Planning Syndrome",
        publish_date: "2021-02-18T12:00:00.000Z",
        overcast_url: "https://overcast.fm/+b1V0WLux0",
        source_url:
          "https://www.buzzsprout.com/1121972/7901239-ep-72-habit-tune-up-excessive-planning-syndrome.mp3",
        url: "https://url",
        listen_date: "2021-09-05T13:51:05.000Z",
        feed_url: "https://feeds.buzzsprout.com/1121972.rss",
      },
      status: "publish",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    }
  );
});
