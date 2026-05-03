import * as overcast from "@tdee/overcast-functions/src/getOvercastListens";
import { expect, jest, test, afterEach } from "@jest/globals";

import { handler } from "../lambda/overcast";
import axios from "axios";
import {
  SSMClient,
  GetParametersCommand,
  Parameter,
} from "@aws-sdk/client-ssm";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";

afterEach(() => {
  jest.restoreAllMocks();
  delete process.env.OVERCAST_EMAIL_PARAM_NAME;
  delete process.env.OVERCAST_PASSWORD_PARAM_NAME;
  delete process.env.BDT_AUTH_TOKEN_PARAM_NAME;
});

const mockSSM = () => {
  process.env.OVERCAST_EMAIL_PARAM_NAME = "/overcast/email";
  process.env.OVERCAST_PASSWORD_PARAM_NAME = "/overcast/password";
  process.env.BDT_AUTH_TOKEN_PARAM_NAME = "/bdt/auth_token";

  const ssmMock = mockClient(SSMClient);
  ssmMock.on(GetParametersCommand).resolves({
    Parameters: [
      {
        Name: "/overcast/email",
        Value: "test@example.com",
        Type: "String",
      },
      {
        Name: "/overcast/password",
        Value: "testpassword",
        Type: "SecureString",
      },
      {
        Name: "/bdt/auth_token",
        Value: "test-bdt-token",
        Type: "SecureString",
      },
    ] as Parameter[],
    InvalidParameters: [],
  });
  return ssmMock;
};

const mockLogin = (successful: boolean) =>
  jest
    .spyOn(overcast, "loginToOvercast")
    .mockImplementation(async () => successful);

const mockListens = (listens: overcast.OvercastListen[]) =>
  jest
    .spyOn(overcast, "getOvercastListens")
    .mockImplementation(async () => listens);

const mockAxios = () =>
  jest.spyOn(axios, "post").mockImplementation(async () => {
    return {
      status: 200,
      data: { link: "", meta: { podcast_title: "title" } },
    };
  });

test("returns 500 when SSM param name env vars are missing", async () => {
  // Do not call mockSSM — env vars are absent
  const result = await handler({});
  expect(result.statusCode).toEqual(500);
});

test("returns 500 when SSM returns an empty value for one secret", async () => {
  process.env.OVERCAST_EMAIL_PARAM_NAME = "/overcast/email";
  process.env.OVERCAST_PASSWORD_PARAM_NAME = "/overcast/password";
  process.env.BDT_AUTH_TOKEN_PARAM_NAME = "/bdt/auth_token";

  const ssmMock = mockClient(SSMClient);
  ssmMock.on(GetParametersCommand).resolves({
    Parameters: [
      { Name: "/overcast/email", Value: "", Type: "String" },
      {
        Name: "/overcast/password",
        Value: "testpassword",
        Type: "SecureString",
      },
      {
        Name: "/bdt/auth_token",
        Value: "test-bdt-token",
        Type: "SecureString",
      },
    ] as Parameter[],
    InvalidParameters: [],
  });

  const result = await handler({});
  expect(result.statusCode).toEqual(500);
});

test("login failed", async () => {
  mockSSM();
  mockLogin(false);

  const result = await handler({});

  expect(result.statusCode).toEqual(401);
});

test("login successful", async () => {
  mockSSM();
  mockLogin(true);
  mockListens([]);
  mockAxios();

  const result = await handler({});

  expect(result.statusCode).toEqual(200);
});

test("login uses credentials fetched from SSM", async () => {
  mockSSM();
  const loginSpy = jest
    .spyOn(overcast, "loginToOvercast")
    .mockImplementation(async () => false);

  mockAxios();

  await handler({});

  expect(loginSpy).toHaveBeenCalledWith("test@example.com", "testpassword");
});

test("calls listen getter with yesterday's date", async () => {
  mockSSM();
  const mockDate = new Date("2020-01-02");
  jest
    .spyOn(global, "Date")
    .mockImplementation(() => mockDate as unknown as Date);

  mockLogin(true);
  mockAxios();
  const listenSpy = mockListens([]);

  await handler({});

  expect(listenSpy).toHaveBeenCalledWith(new Date("2020-01-01"));
});

test("calls listen getter with custom date", async () => {
  mockSSM();
  mockLogin(true);
  mockAxios();
  const listenSpy = mockListens([]);

  await handler({ since: "2019-01-01" });

  expect(listenSpy).toHaveBeenCalledWith(new Date("2019-01-01"));
});

test("posts listens to wordpress with BDT auth token from SSM", async () => {
  mockSSM();
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

  const axiosSpy = mockAxios();

  await handler({});

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
        Authorization: "Bearer test-bdt-token",
      },
    },
  );
});

test("posts all listens to wordpress", async () => {
  mockSSM();
  mockLogin(true);

  const listen = {
    pubDate: new Date("2021-02-18T07:00:00-05:00"),
    title: "Ep. 72: Habit Tune-Up: Excessive Planning Syndrome",
    url: "https://url",
    overcastUrl: "https://overcast.fm/+b1V0WLux0",
    sourceUrl:
      "https://www.buzzsprout.com/1121972/7901239-ep-72-habit-tune-up-excessive-planning-syndrome.mp3",
    userUpdatedDate: new Date("2021-09-05T09:51:05-04:00"),
    feedUrl: "https://feeds.buzzsprout.com/1121972.rss",
  };

  mockListens([listen, listen, listen]);

  const axiosSpy = mockAxios();

  await handler({});

  expect(axiosSpy).toHaveBeenCalledTimes(3);
});

test("returns a 500 with the logs if any posts to BDT fail", async () => {
  mockSSM();
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

  jest
    .spyOn(axios, "post")
    .mockImplementation(async () =>
      Promise.reject(new Error("Connection refused")),
    );

  const result = await handler({});

  expect(result.statusCode).toEqual(500);
});
