import fetch from "node-fetch";
import getBinDays from "./getBinDays";

jest.mock("node-fetch");
const { Response } = jest.requireActual("node-fetch");

const mockFetchWith = (payload: []): void => {
  (fetch as jest.MockedFunction<typeof fetch>).mockReturnValue(
    Promise.resolve(new Response(JSON.stringify(payload)))
  );
};

describe("calls correct API endpoints", () => {
  beforeEach(() => {
    mockFetchWith([]);
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
