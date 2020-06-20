import getListensSince from "./getListensSince";
import { readFileSync } from "fs";
import { join } from "path";

describe("getListensSince", () => {

  // get listens
  // only gets listens since
  // only gets listens that have been played
  it("takes overcast XML and a date, and returns podcasts in the correct format", () => {
    const input = readFileSync(
      join(__dirname, "../__fixtures__/listens.xml")
    ).toString();

    const result = getListensSince(
      new Date("2020-06-19T03:01:00-04:00"),
      input
    );

    expect(result[0]).toMatchObject({
      title: "The Transfer Market & 21st Club",
      url:
        "https://theathletic.com/podcast/197-the-tifo-football-podcast/?episode=19",
      overcastUrl: "https://overcast.fm/+Zuyvu2MpA",
      listenDate: new Date("2020-06-20T07:53:15-04:00"),

    });
  });
});
