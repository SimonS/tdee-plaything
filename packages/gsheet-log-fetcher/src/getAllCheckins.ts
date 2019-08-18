import fetch from "node-fetch";

interface ICheckIn {
  date: Date;
  weight?: number;
  calories?: number;
}

interface IGSheetEntry {
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

const parseStartDate = (dateStr: string): Date => {
  const [_, day, monthStr, year] = /(\d+)-(\w+)-(\d+)/.exec(
    dateStr
  ) as string[];

  return new Date(
    parseInt(year, 10) + 2000,
    Month[monthStr as keyof typeof Month],
    parseInt(day, 10),
    2
  );
};

const entriesToCheckins = (entries: IGSheetEntry[]): ICheckIn[] => {
  const enumeratedEntries = entries.map((entry: IGSheetEntry) =>
    Object.assign(entry, {
      content: entry.gs$cell.$t,
      row: parseInt(entry.gs$cell.row, 10),
      col: parseInt(entry.gs$cell.col, 10)
    })
  );
  const startDate: Date = parseStartDate(
    enumeratedEntries.filter(entry => entry.row === 3 && entry.col === 6)[0]
      .content
  );

  const onlyActualEntries = enumeratedEntries
    .filter(entry => entry.row > 11 && entry.col > 3 && entry.col < 11)
    .map(entry => {
      return {
        content: entry.content,
        row: entry.row - 12,
        col: entry.col - 4
      };
    });

  return onlyActualEntries
    .map(entry => {
      let checkinDate = new Date(startDate);
      const oddRow = entry.row % 2;
      let week = (oddRow ? entry.row - 1 : entry.row) / 2;

      checkinDate.setDate(startDate.getDate() + entry.col + week * 7);
      let currentCheckin: ICheckIn = { date: checkinDate };

      currentCheckin[oddRow ? "calories" : "weight"] = Number(entry.content);
      return currentCheckin;
    })
    .sort((a, b) => a.date.valueOf() - b.date.valueOf())
    .reduce((acc: ICheckIn[], currentCheckin: ICheckIn) => {
      const previousCheckin = acc.filter(entry => {
        return entry.date.valueOf() === currentCheckin.date.valueOf();
      });
      const firstCheckin: boolean = previousCheckin.length === 0;

      if (firstCheckin) {
        return [...acc, currentCheckin];
      }

      return acc.map(entry => {
        if (currentCheckin.date.valueOf() === entry.date.valueOf()) {
          return { ...entry, ...currentCheckin };
        }
        return entry;
      });
    }, []);
};

export const getAllCheckins = async (id: string): Promise<ICheckIn[]> => {
  if (id.length === 0) {
    throw new Error("invalid ID");
  }

  const url = `https://spreadsheets.google.com/feeds/cells/${id}/1/public/values?alt=json`;

  const fullResponse = await fetch(url).then(res => res.json());

  return entriesToCheckins(fullResponse.feed.entry);
};
