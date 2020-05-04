import fetch from "node-fetch";
import {
  BinType,
  BinDayAPIResponse,
  getBinDays,
  getNextBinDay,
} from "./getBinDays";

jest.mock("node-fetch");
const { Response } = jest.requireActual("node-fetch");

const mockFetchWith = (payload: BinDayAPIResponse[]): void => {
  (fetch as jest.MockedFunction<typeof fetch>).mockReturnValue(
    Promise.resolve(new Response(JSON.stringify(payload)))
  );
};

describe("calls correct API endpoints", () => {
  beforeEach(() => {
    mockFetchWith([]);
  });

  afterEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  test("uses correct API endpoint root", async () => {
    const expectedRoot = new RegExp(
      `^http://applications.rochdale.gov.uk/RefuseCollectionCalendar/Home/CollectionDates`
    );

    await getBinDays(new Date());

    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(expectedRoot));
  });

  test("sends correct UPRN", async () => {
    const expectedFragment = `UPRN=23016840`;

    await getBinDays(new Date());

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(expectedFragment)
    );
  });

  test("appends correct date", async () => {
    const expectedDateString = "08/06/1982";
    const inputDate = new Date(1982, 5, 8);

    await getBinDays(inputDate);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`selectedDate=${expectedDateString}`)
    );
  });

  test("when no date supplied defaults to now", async () => {
    const expectedDateString = "14/05/2019";
    jest
      .spyOn(global.Date, "now")
      .mockImplementationOnce(() => new Date("2019-05-14").valueOf());

    await getBinDays();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`selectedDate=${expectedDateString}`)
    );
  });
});

describe("coerces to correct datatypes", () => {
  test("returns correct date", async () => {
    const nextDateShouldBe = 1585634400000;
    mockFetchWith([
      {
        CollectionType: "Waste-MIX",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
    ]);

    const [nextBinDay] = await getBinDays(new Date(nextDateShouldBe));

    expect(nextBinDay.date).toEqual(new Date(nextDateShouldBe));
  });

  test("waste collection types coerce to General Waste", async () => {
    const nextDateShouldBe = 1585634400000;
    mockFetchWith([
      {
        CollectionType: "Waste-RES",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
      {
        CollectionType: "Waste-WASTE",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
      {
        CollectionType: "Waste-CONTAINER",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
    ]);

    const [collectionOne, collectionTwo, collectionThree] = await getBinDays(
      new Date(nextDateShouldBe)
    );

    expect(collectionOne.bin).toEqual(BinType.GENERAL);
    expect(collectionTwo.bin).toEqual(BinType.GENERAL);
    expect(collectionThree.bin).toEqual(BinType.GENERAL);
  });

  test("Plastic collection types coerce to Plastic", async () => {
    const nextDateShouldBe = 1585634400000;
    mockFetchWith([
      {
        CollectionType: "Waste-MIX",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
      {
        CollectionType: "Waste-GLASS",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
    ]);

    const [collectionOne, collectionTwo] = await getBinDays(
      new Date(nextDateShouldBe)
    );

    expect(collectionOne.bin).toEqual(BinType.PLASTIC);
    expect(collectionTwo.bin).toEqual(BinType.PLASTIC);
  });

  test("Paper collection types coerce to Paper", async () => {
    const nextDateShouldBe = 1585634400000;
    mockFetchWith([
      {
        CollectionType: "Waste-PC",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
      {
        CollectionType: "Waste-PAPER",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
    ]);

    const [collectionOne, collectionTwo] = await getBinDays(
      new Date(nextDateShouldBe)
    );

    expect(collectionOne.bin).toEqual(BinType.PAPER);
    expect(collectionTwo.bin).toEqual(BinType.PAPER);
  });

  test("Other types default to Food and Garden", async () => {
    const nextDateShouldBe = 1585634400000;
    mockFetchWith([
      {
        CollectionType: "Waste-GF",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
      {
        CollectionType: "Waste-GardenStuffsButThisCouldBeCalledAnythingTBH",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
    ]);

    const [collectionOne, collectionTwo] = await getBinDays(
      new Date(nextDateShouldBe)
    );

    expect(collectionOne.bin).toEqual(BinType.FOOD);
    expect(collectionTwo.bin).toEqual(BinType.FOOD);
  });
});

describe("getNextBinDay", () => {
  test("handles single bin types", async () => {
    const nextDateShouldBe = 1585634400000;
    const aLaterDate = 1587448800000;

    const date = new Date(nextDateShouldBe);

    mockFetchWith([
      {
        CollectionType: "Waste-MIX",
        StartDate: `/Date(${aLaterDate})/`,
      },
      {
        CollectionType: "Waste-MIX",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
    ]);

    const nextBinDay = await getNextBinDay(date);

    expect(nextBinDay).toMatchObject({ date: date, bins: [BinType.PLASTIC] });
  });

  test("groups bin types correctly", async () => {
    const nextDateShouldBe = 1585634400000;

    const date = new Date(nextDateShouldBe);

    mockFetchWith([
      {
        CollectionType: "Waste-GF",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
      {
        CollectionType: "Waste-MIX",
        StartDate: `/Date(${nextDateShouldBe})/`,
      },
    ]);

    const nextBinDay = await getNextBinDay(date);

    expect(nextBinDay).toMatchObject({
      date: date,
      bins: [BinType.FOOD, BinType.PLASTIC],
    });
  });
});
