import getListensSince, { OvercastListen } from "./getListensSince";
import { readFileSync } from "fs";
import { join } from "path";

describe("getListensSince", () => {
  const loadAndGetListens = (fileTitle: string): OvercastListen[] => {
    const input = readFileSync(
      join(__dirname, `../__fixtures__/${fileTitle}.xml`)
    ).toString();

    return getListensSince(new Date("2020-06-19T03:01:00"), input);
  };

  it("takes overcast XML and a date, and returns podcasts in the correct format", () => {
    const result = loadAndGetListens("listens");
    expect(result[0]).toMatchObject({
      title: "The Transfer Market & 21st Club",
      url:
        "https://theathletic.com/podcast/197-the-tifo-football-podcast/?episode=19",
      overcastUrl: "https://overcast.fm/+Zuyvu2MpA",
      listenDate: new Date("2020-06-20T07:53:15-04:00"),
    });
  });

  it("ignores old listens", () => {
    const result = loadAndGetListens("listens-and-old");
    expect(result).toHaveLength(1);
  });

  it("ignores unplayed", () => {
    const result = loadAndGetListens("listens-and-unplayed");
    expect(result).toHaveLength(1);
  });
});
