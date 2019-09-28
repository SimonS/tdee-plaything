import { SourceNodesArgs, NodeInput } from "gatsby";
import {
  getAllCheckins,
} from "@tdee/gsheet-log-fetcher/src/getAllCheckins";
import { ICheckIn } from "@tdee/types/src/checkins";

export const sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}: SourceNodesArgs) => {
  const { createNode } = actions;

  const checkins: ICheckIn[] = await getAllCheckins(
    "1I1ML9VCovjqTxbmRsS8Gc431rsKmTdPTBQtyJVd2xJM"
  );

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
