import React from "react";
import { render } from "@testing-library/react";
import { LifeLogEntry } from "./lifelog-entry";
import { Film, Podcast, Weighin } from "@tdee/types/src/bdt";

const film: Film = {
  watchedDate: "2024-01-15",
  filmTitle: "Test Film",
  year: 2024,
  rating: 4,
  reviewLink: "https://letterboxd.com",
  content: "Great film",
  meta: { image: "", runtime: 120, original_language: "en" },
};

const podcast: Podcast = {
  listenDate: "2024-01-15T00:00:00",
  podcastTitle: "Test Episode",
  content: "Good episode",
  overcastURL: "https://overcast.fm",
  feedURL: "https://example.com/feed",
  episodeURL: "https://example.com/ep1",
  feedTitle: "Test Podcast",
  feedImage: "",
};

const weighin: Weighin = {
  weighinTime: "2024-01-15T07:00:00",
  weight: 80,
  bodyFatPercentage: 20,
};

describe("LifeLogEntry type dispatch", () => {
  it("renders FilmEntry for a Film entry", () => {
    const { container } = render(<LifeLogEntry entry={film} />);
    expect(container).toHaveTextContent("Viewed");
    expect(container).toHaveTextContent("Test Film");
  });

  it("renders PodcastEntry for a Podcast entry", () => {
    const { container } = render(<LifeLogEntry entry={podcast} />);
    expect(container).toHaveTextContent("Listened");
    expect(container).toHaveTextContent("Test Episode");
  });

  it("renders WeighinEntry for a Weighin entry", () => {
    const { container } = render(<LifeLogEntry entry={weighin} />);
    expect(container).toHaveTextContent("Weighed in at 80 kg");
  });

  it("throws error for unrecognised entry type", () => {
    const invalidEntry = { unknown: "field" } as any;
    expect(() => render(<LifeLogEntry entry={invalidEntry} />)).toThrow(
      "Unrecognised lifelog entry type",
    );
  });
});
