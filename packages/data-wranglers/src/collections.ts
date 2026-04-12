const groupBy = <T, K extends keyof T>(arr: T[], field: K) =>
  arr.reduce<{ [key: string]: T[] }>((acc, item) => {
    const date = item[field];

    if (typeof date === "string") {
      if (acc[date] === undefined) acc[date] = [];
      acc[date].push({ ...item });
    }

    return acc;
  }, {});

const aggregateData = <T>(data: { [key: string]: T[] }) =>
  Object.entries(data).map(([day, items]) => ({
    day,
    value: items.length,
  }));

export { groupBy, aggregateData };
