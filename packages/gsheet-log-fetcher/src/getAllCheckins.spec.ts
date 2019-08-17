import { getAllCheckins } from "./getAllCheckins";

test("should throw an error when no id provided", async () => {
  await expect(getAllCheckins("")).rejects.toThrowError("invalid ID");
});
