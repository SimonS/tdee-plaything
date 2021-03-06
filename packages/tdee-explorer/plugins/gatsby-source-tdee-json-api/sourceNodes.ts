import { SourceNodesArgs, NodeInput } from "gatsby";
import getAllCheckins from "@tdee/gsheet-log-fetcher/src/getAllCheckins";
import { CheckIn } from "@tdee/types/src/checkins";
import * as dotenv from "dotenv";

export const getSpreadsheetID = (): string => {
  const activeEnv =
    process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

  dotenv.config({
    path: `.env.${activeEnv}`,
  });

  const spreadsheetID: string = process.env.SPREADSHEET_ID || "";

  if (spreadsheetID === "") {
    throw new Error(
      `no spreadsheet ID found, add it to your environment variables or locally to '.env.${activeEnv}'`
    );
  }

  return spreadsheetID;
};

export const sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}: SourceNodesArgs): Promise<void> => {
  const { createNode } = actions;

  const checkins: CheckIn[] = await getAllCheckins(getSpreadsheetID());

  checkins.forEach((checkIn: CheckIn) => {
    const strCheckIn = JSON.stringify(checkIn);

    const nodeMeta = {
      id: createNodeId(`checkIn-${checkIn.date}`),
      parent: undefined,
      children: [],
      internal: {
        type: "CheckIn",
        mediaType: "text/html",
        content: strCheckIn,
        contentDigest: createContentDigest(checkIn),
      },
    };

    const node: NodeInput = { ...checkIn, ...nodeMeta };
    createNode(node);
  });
};
