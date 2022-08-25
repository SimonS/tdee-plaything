import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { podcasts } from "../stores/podcasts";
import PodcastCalendar from "./podcasts";
import { GroupedPodcasts } from "@tdee/types/src/bdt";

const grouped: GroupedPodcasts = {
  "2022-01-01": [
    {
      listenDate: "2022-01-01T00000",
      content: "content",
      podcastTitle: "Podcast #1",
      overcastURL: "",
      feedURL: "",
      episodeURL: "",
      feedTitle: "Podcast",
      feedImage: "",
    },
    {
      listenDate: "2022-01-01T00000",
      content: "content",
      podcastTitle: "Podcast #2",
      overcastURL: "",
      feedURL: "",
      episodeURL: "",
      feedTitle: "Podcast",
      feedImage: "",
    },
  ],
};

it("renders the interaction", () => {
  const { container } = render(
    <PodcastCalendar
      aggregated={[{ day: "2022-01-01", value: 2 }]}
      grouped={{}}
      responsive={false}
    />
  );

  expect(container).toHaveTextContent("Jun");
});

it("populates state store with podcast list", () => {
  const { container } = render(
    <PodcastCalendar
      aggregated={[{ day: "2022-01-01", value: 2 }]}
      grouped={grouped}
      responsive={false}
    />
  );

  const firstDate = container.querySelector("g rect");

  if (firstDate) fireEvent.click(firstDate);

  const { podcasts: storeContents } = podcasts.get();
  expect(storeContents).toHaveLength(2);
  expect(storeContents[0].podcastTitle).toEqual("Podcast #1");
});

it("populates state store with selected date", () => {
  const { container } = render(
    <PodcastCalendar
      aggregated={[{ day: "2022-01-01", value: 2 }]}
      grouped={grouped}
      responsive={false}
    />
  );

  const firstDate = container.querySelector("g rect");

  if (firstDate) fireEvent.click(firstDate);

  const { selected } = podcasts.get();
  expect(selected).toEqual("2022-01-01");
});
