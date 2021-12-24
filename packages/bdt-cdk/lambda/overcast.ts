import {
  loginToOvercast,
  getOvercastListens,
} from "@tdee/overcast-functions/src/getOvercastListens";
import axios from "axios";

export const handler = async function (event: {
  email?: string;
  password?: string;
}) {
  const email = event.email ?? process.env.OVERCAST_EMAIL;
  const password = event.password ?? process.env.OVERCAST_PASSWORD;

  if (!email || !password) {
    return {
      statusCode: 401,
      body: "email or password not provided",
    };
  }

  const result = await loginToOvercast(email, password);

  if (!result) {
    return {
      statusCode: 401,
      body: "Login failed",
    };
  }

  // get listens since yesterday, play it safe, I'll dedupe on the data's side
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const listens = await getOvercastListens(yesterday);

  if (listens.length === 0) {
    return {
      statusCode: 200,
      headers: { "content-type": "text/plain" },
      body: "no new listens",
    };
  }

  const {
    title,
    overcastUrl,
    sourceUrl,
    url,
    userUpdatedDate,
    pubDate,
    feedUrl,
  } = listens[0];

  await axios.post(
    "https://breakfastdinnertea.co.uk/wp-json/wp/v2/bdt_podcast_listen",
    {
      meta: {
        podcast_title: title,
        publish_date: pubDate.toISOString(),
        overcast_url: overcastUrl,
        source_url: sourceUrl,
        url,
        listen_date: userUpdatedDate.toISOString(),
        feed_url: feedUrl,
      },
      status: "publish",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BDT_AUTH_TOKEN}`,
      },
    }
  );

  return {
    statusCode: 200,
    headers: { "content-type": "text/plain" },
    body: JSON.stringify(listens),
  };
};
