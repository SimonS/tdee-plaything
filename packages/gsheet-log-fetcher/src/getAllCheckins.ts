import fetch from 'node-fetch';
import { CheckIn } from '@tdee/types/src/checkins';

interface GSheetEntry {
  gs$cell: {
    $t: string;
    row: string;
    col: string;
  };
}

enum Month {
  Jan = 0,
  Feb,
  Mar,
  Apr,
  May,
  Jun,
  Jul,
  Aug,
  Sep,
  Oct,
  Nov,
  Dec
}

const STARTDATE_LOCATION = {
  row: 3,
  col: 6,
};

/** Google Spreadsheet's old API stores dates like '20-Apr-19'. So that's where
 * this abomination comes from. It will break at the end of the century. */
const parseStartDate = (dateStr: string): Date => {
  const [_, day, monthStr, year] = /(\d+)-(\w+)-(\d+)/.exec(
    dateStr,
  ) as string[];

  return new Date(
    parseInt(year, 10) + 2000,
    Month[monthStr as keyof typeof Month],
    parseInt(day, 10),
    2,
  );
};

const entriesToCheckins = (entries: GSheetEntry[]): CheckIn[] => {
  const getRow = (entry: GSheetEntry) => parseInt(entry.gs$cell.row, 10);
  const getCol = (entry: GSheetEntry) => parseInt(entry.gs$cell.col, 10);
  const getContent = (entry: GSheetEntry) => entry.gs$cell.$t;

  const startDate: Date = parseStartDate(
    getContent(
      entries.filter(
        (entry) => getRow(entry) === STARTDATE_LOCATION.row
          && getCol(entry) === STARTDATE_LOCATION.col,
      )[0],
    ),
  );

  const inputtedEntries = entries
    .filter(
      (entry) => getRow(entry) > 11 && getCol(entry) > 3 && getCol(entry) < 11,
    )
    .map((entry) => {
      const row = getRow(entry);
      const col = getCol(entry);
      return {
        content: getContent(entry),
        row: row - 12,
        col: col - 4,
      };
    });

  const typedEntries = inputtedEntries
    .map((entry) => {
      const checkinDate = new Date(startDate);
      const week = (entry.row % 2 ? entry.row - 1 : entry.row) / 2;

      checkinDate.setDate(startDate.getDate() + entry.col + week * 7);
      const currentCheckin: CheckIn = { date: checkinDate };

      currentCheckin[entry.row % 2 ? 'calories' : 'weight'] = Number(
        entry.content,
      );

      return currentCheckin;
    })
    .reduce((acc: CheckIn[], currentCheckin: CheckIn) => {
      const previousCheckin = acc.filter((entry) => entry.date.valueOf() === currentCheckin.date.valueOf());

      if (previousCheckin.length === 0) {
        return [...acc, currentCheckin];
      }

      return acc.map((entry) => (currentCheckin.date.valueOf() === entry.date.valueOf()
        ? { ...entry, ...currentCheckin }
        : entry));
    }, []);

  typedEntries.sort((a, b) => a.date.valueOf() - b.date.valueOf());

  return typedEntries;
};

const getAllCheckins = async (id: string): Promise<CheckIn[]> => {
  if (id.length === 0) {
    throw new Error('invalid ID');
  }

  const url = `https://spreadsheets.google.com/feeds/cells/${id}/1/public/values?alt=json`;
  const fullResponse = await fetch(url).then((res) => res.json());

  return entriesToCheckins(fullResponse.feed.entry);
};

export default getAllCheckins;
