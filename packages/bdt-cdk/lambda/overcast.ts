import {
  loginToOvercast,
  getOvercastListens,
} from "@tdee/overcast-functions/src/getOvercastListens";
import axios from "axios";
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({});

interface OvercastSecrets {
  email: string;
  password: string;
  bdtAuthToken: string;
}

async function getOvercastSecrets(): Promise<OvercastSecrets> {
  const emailParamName = process.env.OVERCAST_EMAIL_PARAM_NAME;
  const passwordParamName = process.env.OVERCAST_PASSWORD_PARAM_NAME;
  const bdtAuthTokenParamName = process.env.BDT_AUTH_TOKEN_PARAM_NAME;

  if (!emailParamName || !passwordParamName || !bdtAuthTokenParamName) {
    throw new Error(
      "Missing required SSM parameter name environment variables (OVERCAST_EMAIL_PARAM_NAME, OVERCAST_PASSWORD_PARAM_NAME, BDT_AUTH_TOKEN_PARAM_NAME).",
    );
  }

  const command = new GetParametersCommand({
    Names: [emailParamName, passwordParamName, bdtAuthTokenParamName],
    WithDecryption: true,
  });

  const { Parameters: params, InvalidParameters } =
    await ssmClient.send(command);
  if (InvalidParameters && InvalidParameters.length > 0) {
    throw new Error(`Invalid SSM parameters: ${InvalidParameters.join(", ")}`);
  }
  if (!params || params.length !== 3) {
    throw new Error("Failed to retrieve all overcast secrets from SSM.");
  }

  const email = params.find((p) => p.Name === emailParamName)?.Value ?? "";
  const password =
    params.find((p) => p.Name === passwordParamName)?.Value ?? "";
  const bdtAuthToken =
    params.find((p) => p.Name === bdtAuthTokenParamName)?.Value ?? "";

  if (!email || !password || !bdtAuthToken) {
    throw new Error("One or more overcast secrets were empty in SSM.");
  }

  console.log("Successfully fetched overcast secrets from SSM.");
  return { email, password, bdtAuthToken };
}

const getYesterday = () => {
  const since = new Date();
  since.setDate(since.getDate() - 1);
  since.setHours(0, 0, 0, 0);
  return since;
};

export const handler = async function (event: { since?: string }) {
  let secrets: OvercastSecrets;
  try {
    secrets = await getOvercastSecrets();
  } catch (error) {
    console.error("Failed to retrieve overcast secrets from SSM:", error);
    return {
      statusCode: 500,
      body: "Failed to retrieve secrets from SSM",
    };
  }

  const since = event.since ? new Date(event.since) : getYesterday();

  const result = await loginToOvercast(secrets.email, secrets.password);

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
              Authorization: `Bearer ${secrets.bdtAuthToken}`,
            },
          },
        ),
    ),
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
