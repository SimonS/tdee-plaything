import React from "react";
import { BinType } from "@tdee/bin-day-fetcher/src/getBinDays";

type BinConfig = {
  baseColour: string;
  lidColour?: string;
};

type BinColours = {
  [bin in BinType]: BinConfig;
};

const binColours: BinColours = {
  Food: { baseColour: "#9D5B28" },
  "General Waste": { baseColour: "#2F3A2B" },
  "Paper and Cardboard": { baseColour: "#0086C1" },
  "Plastic and Glass": { baseColour: "#71B43D", lidColour: "#0086C1" },
};

const Bin = ({ bin }: { bin: BinType }): JSX.Element => {
  const colours = binColours[bin];
  return (
    <>
      <svg
        width="66"
        height="100"
        viewBox="0 0 66 100"
        fill="none"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{bin}</title>
        <path
          d="M53.5368 87.5032C49.996 87.5032 47.071 90.1632 47.071 93.3832C47.071 96.6032 49.996 99.2632 53.5368 99.2632C57.0776 99.2632 60.0026 96.6032 60.0026 93.3832C60.0026 90.1632 57.0776 87.5032 53.5368 87.5032ZM53.5368 96.1832C51.8434 96.1832 50.4579 94.9232 50.4579 93.3832C50.4579 91.8432 51.8434 90.5832 53.5368 90.5832C55.2303 90.5832 56.6158 91.8432 56.6158 93.3832C56.7697 94.9232 55.3842 96.1832 53.5368 96.1832Z"
          fill="black"
        />
        <path
          d="M53.8447 85.9632C55.2303 85.9632 56.4618 86.2432 57.6934 86.8032L58.1553 15.2632L56.6158 13.5832C53.8447 14.2832 50.3039 13.5832 49.6882 13.5832H49.5342C37.5263 10.6432 18.129 15.8232 16.2816 17.0832H16.1276C12.125 18.7632 8.89211 19.0432 6.5829 18.7632L8.27632 94.0832C8.27632 96.0432 10.1237 97.5832 12.2789 97.5832H46.3013C45.6855 96.4632 45.2237 95.2032 45.2237 93.8032C45.2237 89.4632 49.0724 85.9632 53.8447 85.9632Z"
          fill={colours.baseColour}
        />
        <path
          d="M61.2342 6.72316C60.9263 6.72316 60.6184 6.86316 60.3105 6.86316C60.1566 6.86316 60.0026 6.86316 59.8487 6.86316H2.42632C1.65658 6.86316 1.04079 7.28316 1.04079 7.98316V14.5632C1.04079 14.9832 1.19474 15.2632 1.65658 15.5432C3.19605 16.3832 7.96842 18.3432 15.8197 15.1232H15.9737C17.975 14.0032 37.2184 8.82316 49.2263 11.6232H49.3803C49.9961 11.7632 54.4605 12.4632 57.3855 11.6232C58.0013 13.0232 59.3868 14.0032 61.2342 14.0032C63.5434 14.0032 65.2368 12.3232 65.2368 10.3632C65.3908 8.40316 63.5434 6.72316 61.2342 6.72316ZM61.2342 12.4632C60.0026 12.4632 59.0789 11.6232 59.0789 10.5032C59.0789 9.38316 60.0026 8.54316 61.2342 8.54316C62.4658 8.54316 63.3895 9.38316 63.3895 10.5032C63.5434 11.4832 62.4658 12.4632 61.2342 12.4632Z"
          fill={colours.baseColour}
        />
        <path
          d="M58.1553 3.22316C58.1553 1.96316 57.0776 1.12316 56 1.12316H53.5369H11.9711H8.73816C7.66053 1.12316 6.5829 1.96316 6.5829 3.22316V5.04316H58.3092V3.22316H58.1553Z"
          fill={colours.lidColour ?? colours.baseColour}
        />
      </svg>
    </>
  );
};

export default Bin;