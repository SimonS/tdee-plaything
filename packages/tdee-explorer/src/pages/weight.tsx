import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts/layout";

import { CheckIn } from "@tdee/types/src/checkins";
import TDEEGraph from "../components/tdee-graph";

interface CheckInQuery {
  data: {
    allCheckIn: {
      nodes: {
        date: string;
        weight: number;
        calories: number;
      }[];
    };
  };
}

export const query = graphql`
  query AllCheckIns {
    allCheckIn {
      nodes {
        date
        weight
        calories
      }
    }
  }
`;

const asCheckIns = (checkInNodes): CheckIn[] =>
  checkInNodes.map((d) => ({ ...d, date: new Date(d.date) }));

const WeightPage = ({ data }: CheckInQuery): JSX.Element => (
  <Layout>
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
    <TDEEGraph
      height={400}
      width={800}
      checkIns={asCheckIns(data.allCheckIn.nodes)}
    />
  </Layout>
);

export default WeightPage;
