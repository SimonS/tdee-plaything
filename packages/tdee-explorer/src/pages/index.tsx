import React from "react";
import { graphql } from "gatsby";
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

const IndexPage = ({ data }: CheckInQuery) => (
  <div style={{ margin: `3rem auto`, maxWidth: 600 }}>
    <h1>Weight Over Time:</h1>
    <TDEEGraph checkIns={data.allCheckIn.nodes} />
  </div>
);

export default IndexPage;
