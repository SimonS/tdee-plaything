jest.mock("node-fetch");
import fetch from "node-fetch";
import { realData } from "../__FIXTURES__/realData";
import { getAllCheckins } from "./getAllCheckins";

const { Response } = jest.requireActual("node-fetch");
let allCheckins;

beforeAll(async () => {
  (fetch as any).mockReturnValue(
    Promise.resolve(new Response(JSON.stringify(realData)))
  );
  allCheckins = await getAllCheckins("foo");
});

test("throws an error when no id provided", async () => {
  await expect(getAllCheckins("")).rejects.toThrowError("invalid ID");
});

test("first checkin has correct implicit date", async () => {
  await expect(allCheckins[0]).toMatchObject({
    date: new Date(2019, 3, 29, 2)
  });
});

test("further checkins in that week have correct calculated date", async () => {
  await expect(allCheckins[2]).toMatchObject({
    date: new Date(2019, 4, 1, 2)
  });
});

test("further checkins in next week have correct calculated date", async () => {
  await expect(allCheckins[8]).toMatchObject({
    date: new Date(2019, 4, 7, 2)
  });
});

test("first checkin has weight", async () => {
  await expect(allCheckins[0]).toMatchObject({ weight: 89.4 });
});

test("first checkin consolidates weight and calories", async () => {
  await expect(allCheckins[0]).toMatchObject({ calories: 2572 });
});

test("further checkins consolidate weight and calories", async () => {
  await expect(allCheckins[11]).toMatchObject({ calories: 2064 });
});
