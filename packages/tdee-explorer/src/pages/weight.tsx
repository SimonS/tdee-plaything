import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts/layout";







const WeightPage = ({
  location,
}: {
  location?: { pathname: string };
}): JSX.Element => (
  <Layout pathname={location?.pathname}>
    <h1>Weight</h1>
    <p>
      A little experiment I ran during 2019 - leading to 11kg weight loss (think
      I&apos;m back up about half of that currently). Largely documented in this
      project&apos;s{" "}
      <a href="https://github.com/SimonS/tdee-plaything">GitHub Readme</a>.
    </p>
    <p>
      It&apos;s clearly unloved right now, but I have imminent plans to revisit.
    </p>
    
  </Layout>
);

export default WeightPage;
