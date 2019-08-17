import { getAllCheckins } from "./getAllCheckins";

test("real spreadsheet returns a non-empty array", async () => {
  await expect(
    getAllCheckins("***REMOVED***")
  ).resolves.not.toHaveLength(0);
});
