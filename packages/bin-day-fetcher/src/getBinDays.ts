import fetch from "node-fetch";
import * as dateformat from "dateFormat";

interface BinDay {
  date: Date;
}

interface RawJSONInstance {
  ID?: string;
  PostCode?: string;
  EvenNumber?: boolean;
  CollectionTypeID?: string;
  CollectionType: string;
  StartDate: string;
  DayOfWeek?: number;
  RepeatCycle?: number;
  ActualDate: string;
  FullAddress?: string | null;
  UPRN?: number;
}

const getBinDays = async (date?: Date): Promise<BinDay[]> => {
  if (!date) {
    date = new Date(Date.now());
  }
  const apiRoot =
    "http://applications.rochdale.gov.uk/RefuseCollectionCalendar/Home/CollectionDates";
  const UPRN = "23016840";
  const formattedDate = dateformat(date, "dd/mm/yyyy");

  return await fetch(`${apiRoot}?UPRN=${UPRN}&selectedDate=${formattedDate}`)
    .then(res => res.json())
    .then((binDays: RawJSONInstance[]) =>
      binDays.map(binDay => {
        const dateStamp = parseInt(
          binDay.StartDate.replace(/\/Date\((\d+)\)\//, "$1"),
          10
        );
        return { date: new Date(dateStamp) };
      })
    );
};

export default getBinDays;
