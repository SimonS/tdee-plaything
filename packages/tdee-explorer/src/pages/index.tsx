import React from "react";
import { graphql } from "gatsby";

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
    <h1>My Weight and Calorie Consumption Over Time:</h1>
    <>
      {data.allCheckIn.nodes.map(node => (
        <pre>{JSON.stringify(node, null, 2)}</pre>
      ))}
    </>
  </div>
);

export default IndexPage;
