import {
  loginToOvercast,
  getOvercastListens,
} from "@tdee/overcast-functions/src/getOvercastListens";
import axios from "axios";

const getYesterday = () => {
  const since = new Date();
  since.setDate(since.getDate() - 1);
  since.setHours(0, 0, 0, 0);
  return since;
};

export const handler = async function (event: {
  email?: string;
  password?: string;
  since?: string;
}) {
  const email = event.email ?? process.env.OVERCAST_EMAIL;
  const password = event.password ?? process.env.OVERCAST_PASSWORD;
  const since = event.since ? new Date(event.since) : getYesterday();

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

  const listens = await getOvercastListens(since);

  if (listens.length === 0) {
    return {
      statusCode: 200,
      headers: { "content-type": "text/plain" },
      body: "no new listens",
    };
  }

  const results = await Promise.allSettled(
    listens.map(
      ({
        title,
        overcastUrl,
        sourceUrl,
        url,
        userUpdatedDate,
        pubDate,
        feedUrl,
      }) =>
        axios.post(
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
        )
    )
  );

  const statuses = results.map((result) => {
    if (result.status === "fulfilled") {
      return {
        status: result.value.status,
        post_link: result.value.data.link,
        title: result.value.data.meta.podcast_title,
      };
    }

    return {
      reason: result.reason,
    };
  });

  const hasErrors = statuses.filter((status) => status.reason).length > 0;

  return {
    statusCode: hasErrors ? 500 : 200,
    headers: { "content-type": "text/json" },
    body: statuses,
  };
};
