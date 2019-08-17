import { getAllCheckins } from "./getAllCheckins";

test("should throw an error when no id provided", async () => {
  await expect(getAllCheckins("")).rejects.toThrowError("invalid ID");
});

describe("happy path integration tests", () => {
  test("real spreadsheet returns a non-empty array", async () => {
    await expect(
      getAllCheckins("***REMOVED***")
    ).resolves.not.toHaveLength(0);
  });
});
