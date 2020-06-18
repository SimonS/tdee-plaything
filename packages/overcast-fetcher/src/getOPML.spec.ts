import getOPML from "./getOPML";
import { readFileSync } from "fs";
import * as nock from "nock";
import * as mock from "mock-fs";

const rootUrl = "https://overcast.fm/";

describe("getOPML", () => {
  it("logs in and returns a relevant XML file", async () => {
    const latestOPML = "new file contents";
    mock({ "./extended.opml": "previous file contents" });
    nock(rootUrl)
      .post("/login", "then=podcasts&email=email&password=password")
      .reply(302, undefined, { location: "podcasts" })
      .get("/podcasts")
      .reply(200)
      .get("/account/export_opml/extended")
      .reply(200, latestOPML);

    await getOPML("email", "password");

    const result = readFileSync("./extended.opml", "utf-8");
    expect(result).toEqual(latestOPML);
    mock.restore();
  });
});
