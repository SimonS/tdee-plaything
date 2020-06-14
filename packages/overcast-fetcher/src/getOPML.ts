import fetch from "node-fetch";

const getOPML = async () => {
  const url = `https://overcast.fm/account/export_opml/extended`;
  const fullResponse = await fetch(url).then((res) => res.text());
  console.log(fullResponse);
};

getOPML();
