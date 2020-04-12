import { SourceNodesArgs, NodeInput } from "gatsby";
import { getBinDays, BinDay } from "@tdee/bin-day-fetcher/src/getBinDays";

export const sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}: SourceNodesArgs): Promise<void> => {
  const { createNode } = actions;

  const binDays: BinDay[] = await getBinDays();

  binDays.forEach((binDay: BinDay, i: number) => {
    const strBinDay = JSON.stringify(binDay);

    const nodeMeta = {
      id: createNodeId(`binDay-${i}`),
      parent: undefined,
      children: [],
      internal: {
        type: "BinDay",
        mediaType: "text/html",
        content: strBinDay,
        contentDigest: createContentDigest(binDay),
      },
    };

    const node: NodeInput = { ...binDay, ...nodeMeta };
    createNode(node);
  });
};
