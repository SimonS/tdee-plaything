import { SourceNodesArgs, PluginOptions, NodeInput } from "gatsby";

export const sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}: SourceNodesArgs) => {
  const { createNode } = actions;

  const myData = {
    key: 123,
    foo: `The foo field of my node`,
    bar: `Baz`,
  };

  const nodeContent = JSON.stringify(myData);

  const nodeMeta = {
    id: createNodeId(`my-data-${myData.key}`),
    parent: undefined,
    children: [],
    internal: {
      type: `CheckIn`,
      mediaType: `text/html`,
      content: nodeContent,
      contentDigest: createContentDigest(myData),
    },
  };

  const node: NodeInput = Object.assign({}, myData, nodeMeta);
  createNode(node);
};
