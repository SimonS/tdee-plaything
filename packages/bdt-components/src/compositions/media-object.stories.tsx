import React from "react";
import { Meta } from "@storybook/react";
import MediaObject from "./media-object";
import Centered from "../layouts/centered/centered";

export default {
  title: "Compositions/MediaObject",
  component: MediaObject,
} as Meta;

export const MediaObjectComponent = (): JSX.Element => {
  return (
    <Centered>
      <MediaObject
        imgObj={{ src: "https://via.placeholder.com/154", alt: "Placeholder" }}
      >
        <header>
          <h2>Film (Year)</h2>
        </header>
        <dl>
          <dt>Viewed</dt>
          <dd>
            <time className="dt-published" dateTime={``}>
              12
            </time>
          </dd>
          <dt>Rated</dt>
          <dd>3/5</dd>
        </dl>
        <a href={`/films`}>I wrote some thoughts on Letterboxd</a>
      </MediaObject>
    </Centered>
  );
};
