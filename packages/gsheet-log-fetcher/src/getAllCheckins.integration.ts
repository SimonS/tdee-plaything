import { getAllCheckins } from "./getAllCheckins";

test("real spreadsheet returns a non-empty array", async () => {
  await expect(
    getAllCheckins("1I1ML9VCovjqTxbmRsS8Gc431rsKmTdPTBQtyJVd2xJM")
  ).resolves.not.toHaveLength(0);
});
