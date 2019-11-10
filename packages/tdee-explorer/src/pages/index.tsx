import React from 'react';
import { graphql } from 'gatsby';
import { CheckIn } from '@tdee/types/src/checkins';
import TDEEGraph from '../components/tdee-graph';

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

const asCheckIns = (checkInNodes): CheckIn[] => checkInNodes
  .map((d) => ({ ...d, date: new Date(d.date) }));

const IndexPage = ({ data }: CheckInQuery): JSX.Element => (
  <div style={{ margin: '3rem auto', maxWidth: 800 }}>
    <TDEEGraph
      height={400}
      width={800}
      checkIns={asCheckIns(data.allCheckIn.nodes)}
    />
  </div>
);

export default IndexPage;
