import { SourceNodesArgs, NodeInput } from "gatsby";
import { getAllCheckins } from "@tdee/gsheet-log-fetcher/src/getAllCheckins";
import { ICheckIn } from "@tdee/types/src/checkins";

const getSpreadsheetID = () => {
  const activeEnv =
    process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

  require("dotenv").config({
    path: `.env.${activeEnv}`,
  });

  const spreadsheetID: string = process.env.SPREADSHEET_ID || "";

  if (spreadsheetID === "") {
    throw new Error(
      "no spreadsheet ID found, add it to your environment variables or locally to '.env.development'"
    );
  }

  return spreadsheetID;
};

export const sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}: SourceNodesArgs) => {
  const { createNode } = actions;

  const checkins: ICheckIn[] = await getAllCheckins(getSpreadsheetID());

  checkins.forEach((checkIn: ICheckIn) => {
    const strCheckIn = JSON.stringify(checkIn);

    const nodeMeta = {
      id: createNodeId(`checkIn-${checkIn.date}`),
      parent: undefined,
      children: [],
      internal: {
        type: `CheckIn`,
        mediaType: `text/html`,
        content: strCheckIn,
        contentDigest: createContentDigest(checkIn),
      },
    };

    const node: NodeInput = Object.assign({}, checkIn, nodeMeta);
    createNode(node);
  });
};
