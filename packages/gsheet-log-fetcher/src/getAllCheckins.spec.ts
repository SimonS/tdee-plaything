import { getAllCheckins } from "./getAllCheckins";

test("should throw an error when no id provided", async () => {
  await expect(getAllCheckins("")).rejects.toThrowError("invalid ID");
});

describe("happy path integration tests", () => {
  test("real spreadsheet returns a non-empty array", async () => {
    await expect(
      getAllCheckins("1I1ML9VCovjqTxbmRsS8Gc431rsKmTdPTBQtyJVd2xJM")
    ).resolves.not.toHaveLength(0);
  });
});
