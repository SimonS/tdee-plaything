import fetch from "node-fetch";
import * as dateformat from "dateFormat";

export enum BinType {
  FOOD = "Food",
  GENERAL = "General Waste",
  PAPER = "Paper and Cardboard",
  PLASTIC = "Plastic and Glass"
}

interface BinDay {
  date: Date;
  bin: BinType;
}

export interface BinDayAPIResponse {
  CollectionType: string;
  StartDate: string;
}

const coerceCollectionType = (CollectionType: string): BinType => {
  switch (CollectionType) {
    case "Waste-RES":
    case "Waste-WASTE":
    case "Waste-CONTAINER":
      return BinType.GENERAL;
    case "Waste-MIX":
    case "Waste-GLASS":
      return BinType.PLASTIC;
    case "Waste-PC":
    case "Waste-PAPER":
      return BinType.PAPER;
    default:
      return BinType.FOOD;
  }
};

export const getBinDays = async (date?: Date): Promise<BinDay[]> => {
  if (!date) {
    date = new Date(Date.now());
  }
  const apiRoot =
    "http://applications.rochdale.gov.uk/RefuseCollectionCalendar/Home/CollectionDates";
  const UPRN = "23016840";
  const formattedDate = dateformat(date, "dd/mm/yyyy");

  return await fetch(`${apiRoot}?UPRN=${UPRN}&selectedDate=${formattedDate}`)
    .then(res => res.json())
    .then((binDays: BinDayAPIResponse[]) =>
      binDays.map(binDay => {
        const dateStamp = parseInt(
          binDay.StartDate.replace(/\/Date\((\d+)\)\//, "$1"),
          10
        );
        return {
          date: new Date(dateStamp),
          bin: coerceCollectionType(binDay.CollectionType)
        };
      })
    );
};

export const getNextBinDay = async (
  date?: Date
): Promise<{ date?: Date; bins?: BinType[] }> => {
  if (!date) {
    date = new Date(Date.now());
  }

  const allBinDays = await getBinDays(date);

  const nextDate = [...allBinDays].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )[0].date;

  const binDaysForDate = [...allBinDays]
    .filter(binDay => binDay.date.getTime() === nextDate.getTime())
    .map(binDay => binDay.bin);

  return { date: nextDate, bins: binDaysForDate };
};
