import React from "react";
import { act, render } from "@testing-library/react";
import { podcasts as podcastsStore } from "../stores/podcasts";
import Podcasts from "./podcasts";

describe("Podcasts", () => {
  const pods = [
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
  ];

  beforeEach(() => podcastsStore.set({ podcasts: [] }));

  it("highlights the correct word when appropriate", () => {
    const { container } = render(<Podcasts />);
    expect(container).toHaveTextContent(
      "Click a date to show listened podcasts for that day"
    );
  });

  it("removes default text when stores populated", () => {
    const { container } = render(<Podcasts />);
    act(() => podcastsStore.set({ ...podcastsStore, podcasts: pods }));
    expect(container).not.toHaveTextContent(
      "Click a date to show listened podcasts for that day"
    );
  });

  it("displays contents of stores as podcasts", () => {
    const { container } = render(<Podcasts />);
    act(() => podcastsStore.set({ ...podcastsStore, podcasts: pods }));
    expect(container).toHaveTextContent("Podcast #1");
    expect(container).toHaveTextContent("Podcast #2");
  });
});
