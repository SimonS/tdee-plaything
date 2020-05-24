import pageInfosCollector from "../../utils/pageInfosCollector";

describe("pageInfosCollector", () => {
  it("takes perPage greater than total items and returns single item array", async () => {
    const singlePageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "YXJyYXljb25uZWN0aW9uOjUxMQ==",
      endCursor: "YXJyYXljb25uZWN0aW9uOjQyNA==",
    };

    const returned = {
      data: {
        bdt: {
          posts: {
            pageInfo: { ...singlePageInfo },
          },
        },
      },
    };

    const result = await pageInfosCollector(
      25,
      jest.fn(async () => returned)
    );

    expect(result).toEqual([{ ...singlePageInfo }]);
  });
});
