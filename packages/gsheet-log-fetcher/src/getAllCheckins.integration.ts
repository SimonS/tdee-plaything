import { getSpreadsheetID } from "@tdee/tdee-explorer/plugins/gatsby-source-tdee-json-api/sourceNodes";
import getAllCheckins from "./getAllCheckins";

test("real spreadsheet returns a non-empty array", async () => {
  await expect(getAllCheckins(getSpreadsheetID())).resolves.not.toHaveLength(0);
});
