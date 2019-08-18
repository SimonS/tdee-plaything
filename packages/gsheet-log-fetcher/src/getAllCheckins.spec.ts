jest.mock("node-fetch");
import fetch from "node-fetch";
import { realData } from "../__FIXTURES__/realData";
import { getAllCheckins } from "./getAllCheckins";

const { Response } = jest.requireActual("node-fetch");

test("throws an error when no id provided", async () => {
  await expect(getAllCheckins("")).rejects.toThrowError("invalid ID");
});

test("first checkin has correct implicit date", async () => {
  (fetch as any).mockReturnValue(
    Promise.resolve(new Response(JSON.stringify(realData)))
  );
  const firstCheckin = await getAllCheckins("foo").then(res => res[0]);

  await expect(firstCheckin).toMatchObject({ date: new Date(2019, 3, 29, 2) });
});

test("further checkins in that week have correct calculated date", async () => {
  (fetch as any).mockReturnValue(
    Promise.resolve(new Response(JSON.stringify(realData)))
  );

  const firstCheckinOfNewMonth = await getAllCheckins("foo").then(
    res => res[2]
  );

  await expect(firstCheckinOfNewMonth).toMatchObject({
    date: new Date(2019, 4, 1, 2)
  });
});

test("further checkins in next week have correct calculated date", async () => {
  (fetch as any).mockReturnValue(
    Promise.resolve(new Response(JSON.stringify(realData)))
  );
  const checkinInFollowingWeek = await getAllCheckins("foo").then(
    res => res[8]
  );

  await expect(checkinInFollowingWeek).toMatchObject({
    date: new Date(2019, 4, 7, 2)
  });
});

test("first checkin has weight", async () => {
  (fetch as any).mockReturnValue(
    Promise.resolve(new Response(JSON.stringify(realData)))
  );
  const firstCheckin = await getAllCheckins("foo").then(res => res[0]);

  await expect(firstCheckin).toMatchObject({ weight: 89.4 });
});

test("first checkin consolidates weight and calories", async () => {
  (fetch as any).mockReturnValue(
    Promise.resolve(new Response(JSON.stringify(realData)))
  );
  const firstCheckin = await getAllCheckins("foo");
  await expect(firstCheckin[0]).toMatchObject({ calories: 2572 });
});

test("further checkins consolidate weight and calories", async () => {
  (fetch as any).mockReturnValue(
    Promise.resolve(new Response(JSON.stringify(realData)))
  );
  const checkins = await getAllCheckins("foo");
  await expect(checkins[11]).toMatchObject({ calories: 2064 });
});
