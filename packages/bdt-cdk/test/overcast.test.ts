import * as overcast from "@tdee/overcast-functions/src/getOvercastListens";
import { handler } from "../lambda/overcast";

afterEach(() => {
  jest.clearAllMocks();
});

const mockLogin = (successful: boolean) =>
  jest
    .spyOn(overcast, "loginToOvercast")
    .mockImplementation(async (email: string, password: string) => successful);

const mockListens = () =>
  jest
    .spyOn(overcast, "getOvercastListens")
    .mockImplementation(async (since?: Date) => []);

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
  mockListens();

  const result = await handler({
    email: "someemail@gmail.com",
    password: "mypassword",
  });

  expect(result.statusCode).toEqual(200);
});

test("calls listen getter with yesterday's date", async () => {
  const mockDate = new Date("2020-01-02");
  jest
    .spyOn(global, "Date")
    .mockImplementation(() => mockDate as unknown as string);

  mockLogin(true);
  const listenSpy = mockListens();

  await handler({
    email: "someemail@gmail.com",
    password: "mypassword",
  });

  expect(listenSpy).toHaveBeenCalledWith(new Date("2020-01-01"));
});
