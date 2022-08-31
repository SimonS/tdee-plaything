const groupBy = <T, K extends keyof T>(arr: T[], field: K) =>
  arr.reduce<{ [key: string]: T[] }>((acc, item) => {
    const date = item[field] as unknown as string;

    if (acc[date] === undefined) acc[date] = [];
    acc[date].push({ ...item });

    return acc;
  }, {});

export { groupBy };
