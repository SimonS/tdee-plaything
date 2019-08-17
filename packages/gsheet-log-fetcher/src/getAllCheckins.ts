import fetch from "node-fetch";

export const getAllCheckins = async (id: string): Promise<Array<{}>> => {
  if (id.length === 0) {
    throw new Error("invalid ID");
  }

  const url = `https://spreadsheets.google.com/feeds/cells/${id}/1/public/values?alt=json`;
  const fullResponse = await fetch(url).then(res => res.json());

  return fullResponse.feed.entry;
};
