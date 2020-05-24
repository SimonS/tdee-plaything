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

  it("iterates over multiple pages of queries", async () => {
    const expectedResults = [
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
            posts: {
              pageInfo: { ...expectedResults[0] },
            },
          },
        },
      })
      .mockReturnValueOnce({
        data: {
          bdt: {
            posts: {
              pageInfo: { ...expectedResults[1] },
            },
          },
        },
      })
      .mockReturnValue({
        data: {
          bdt: {
            posts: {
              pageInfo: { ...expectedResults[2] },
            },
          },
        },
      });

    const result = await pageInfosCollector(10, mockedGraphQL);

    expect(result).toEqual([...expectedResults]);
  });
});
