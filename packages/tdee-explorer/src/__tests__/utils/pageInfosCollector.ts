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
          films: {
            pageInfo: { ...singlePageInfo },
          },
        },
      },
    };

    const result = await pageInfosCollector(
      25,
      jest.fn(async () => returned)
    );

    expect(result).toEqual([{ ...singlePageInfo, after: "" }]);
  });

  it("iterates over multiple pages of queries", async () => {
    const pageInfos = [
      {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: "YXJyYXljb25uZWN0aW9uOjUxMQ==",
        endCursor: "YXJyYXljb25uZWN0aW9uOjQ3Mg==",
      },
      {
        hasNextPage: true,
        hasPreviousPage: true,
        startCursor: "YXJyYXljb25uZWN0aW9uOjQ3MQ==",
        endCursor: "YXJyYXljb25uZWN0aW9uOjQzNw==",
      },
      {
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: "YXJyYXljb25uZWN0aW9uOjQzNg==",
        endCursor: "YXJyYXljb25uZWN0aW9uOjQyNA==",
      },
    ];

    const mockedGraphQL = jest
      .fn()
      .mockReturnValueOnce({
        data: {
          bdt: {
            films: {
              pageInfo: { ...pageInfos[0] },
            },
          },
        },
      })
      .mockReturnValueOnce({
        data: {
          bdt: {
            films: {
              pageInfo: { ...pageInfos[1] },
            },
          },
        },
      })
      .mockReturnValue({
        data: {
          bdt: {
            films: {
              pageInfo: { ...pageInfos[2] },
            },
          },
        },
      });

    const result = await pageInfosCollector(10, mockedGraphQL);

    expect(result).toEqual([
      ...pageInfos.map((pageInfo, i) => {
        return { ...pageInfo, after: i > 0 ? pageInfos[i - 1].endCursor : "" };
      }),
    ]);
  });
});
