import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { BinType } from "@tdee/bin-day-fetcher/src/getBinDays";

interface BinDayInfo {
  date: Date;
  bins: BinType[];
}

const getNextBinDay = ({
  allBinDay: {
    group: [firstBinDay],
  },
}): BinDayInfo => ({
  date: firstBinDay.fieldValue,
  bins: firstBinDay.nodes.map((node) => node.bin),
});

const BinDay = (): JSX.Element => {
  const data = getNextBinDay(
    useStaticQuery(graphql`
      {
        allBinDay {
          group(field: date) {
            fieldValue
            nodes {
              bin
            }
          }
        }
      }
    `)
  );
  return (
    <>
      <h2>Next Bin Day: {new Date(data.date).toLocaleDateString()}</h2>
      <ul>
        {data.bins.map((bin, i) => (
          <li key={i}>{bin}</li>
        ))}
      </ul>
    </>
  );
};

export default BinDay;
