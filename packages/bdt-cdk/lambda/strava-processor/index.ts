import { SQSEvent } from "aws-lambda";
import {
  SSMClient,
  GetParametersCommand,
  GetParameterCommand,
} from "@aws-sdk/client-ssm";

import axios from "axios";

const ssmClient = new SSMClient({});

interface StravaCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  description?: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type?: string;
  start_date: string;
  start_date_local: string;
  map?: { summary_polyline?: string };
}

interface WordPressExerciseMeta {
  source_platform: string;
  source_id: string;
  activity_type: string;
  distance_meters: number;
  moving_time_seconds: number;
  elapsed_time_seconds: number;
  total_elevation_gain_meters: number;
  start_date_local_iso: string;
  map_summary_polyline: string;
  _raw_data_json: string;
}

export interface WordPressExercisePayload {
  title: string;
  content: string;
  status: "publish";
  meta: WordPressExerciseMeta;
}

export function stravaToWordpress(
  activity: StravaActivity,
): WordPressExercisePayload {
  return {
    title: activity.name || `Strava Activity ${activity.id}`,
    content: activity.description ?? "",
    status: "publish",
    meta: {
      source_platform: "strava",
      source_id: String(activity.id),
      activity_type: activity.type,
      distance_meters: activity.distance,
      moving_time_seconds: activity.moving_time,
      elapsed_time_seconds: activity.elapsed_time,
      total_elevation_gain_meters: activity.total_elevation_gain,
      start_date_local_iso: activity.start_date_local,
      map_summary_polyline: activity.map?.summary_polyline ?? "",
      _raw_data_json: JSON.stringify(activity),
    },
  };
}

export async function postExerciseToWordpress(
  payload: WordPressExercisePayload,
  authToken: string,
): Promise<void> {
  const apiBaseUrl = process.env.WORDPRESS_API_BASE_URL;
  if (!authToken || !apiBaseUrl) {
    throw new Error("Missing WordPress configuration.");
  }
  await axios.post(`${apiBaseUrl}/bdt_exercises`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log("Exercise posted to WordPress successfully.");
}

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log(`Processor Lambda invoked with ${event.Records.length} record.`);

  let accessToken: string;
  let bdtAuthToken: string;
  try {
    [accessToken, bdtAuthToken] = await Promise.all([
      getStravaAccessToken(),
      getBdtAuthToken(),
    ]);
    console.log("Access token refreshed.");
  } catch (error) {
    console.error("Error fetching credentials:", error);
    throw error;
  }

  for (const record of event.Records) {
    console.log("Processing SQS message:", record.messageId);
    console.log("Body:", record.body);

    try {
      const messageData = JSON.parse(record.body);
      const { object_type, object_id, aspect_type } = messageData;

      if (
        object_type === "activity" &&
        (aspect_type === "create" || aspect_type === "update")
      ) {
        console.log(`Processing activity ${object_id} (${aspect_type})`);

        const data = await getStravaActivity(accessToken, object_id);
        const wpPayload = stravaToWordpress(data);
        await postExerciseToWordpress(wpPayload, bdtAuthToken);
      } else {
        console.log(
          `Ignoring message for object_type ${object_type}, aspect_type ${aspect_type}`,
        );
      }
    } catch (error) {
      console.error(`Error processing SQS message ${record.messageId}:`, error);
    }
  }

  console.log("Processing complete.");
};

async function getStravaAccessToken(): Promise<string> {
  const credentials = await getStravaCredentials();

  const tokenUrl = "https://www.strava.com/oauth/token";
  const params = new URLSearchParams();
  params.append("client_id", credentials.clientId);
  params.append("client_secret", credentials.clientSecret);
  params.append("refresh_token", credentials.refreshToken);
  params.append("grant_type", "refresh_token");

  try {
    console.log("Requesting new Strava access token...");

    const response = await axios.post(tokenUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (response.data?.access_token) {
      console.log("Successfully obtained new access token.");
      return response.data.access_token;
    } else {
      throw new Error("Access token not found in Strava response.");
    }
  } catch (error) {
    const e = error as { response?: { data?: unknown }; message?: string };
    console.error(
      "Error refreshing Strava token:",
      e.response?.data || e.message,
    );
    throw new Error("Failed to refresh Strava access token.");
  }
}

async function getStravaCredentials(): Promise<StravaCredentials> {
  const clientIdParam = process.env.STRAVA_CLIENT_ID_PARAM_NAME;
  const clientSecretParam = process.env.STRAVA_SECRET_PARAM_NAME;
  const refreshTokenParam = process.env.STRAVA_REFRESH_TOKEN_PARAM_NAME;

  if (!clientIdParam || !clientSecretParam || !refreshTokenParam) {
    console.error(
      "FATAL: Missing required SSM parameter name environment variables (STRAVA_CLIENT_ID_PARAM_NAME, STRAVA_SECRET_PARAM_NAME, STRAVA_REFRESH_TOKEN_PARAM_NAME).",
    );
    throw new Error("Missing Strava credential configuration.");
  }

  const ssmParameterNames = [
    clientIdParam,
    clientSecretParam,
    refreshTokenParam,
  ];
  const command = new GetParametersCommand({
    Names: ssmParameterNames,
    WithDecryption: true,
  });

  const { Parameters: params, InvalidParameters } =
    await ssmClient.send(command);
  if (InvalidParameters && InvalidParameters.length > 0) {
    throw new Error(`Invalid parameters: ${InvalidParameters.join(", ")}`);
  }
  if (!params || params.length !== 3) {
    throw new Error("Failed to retrieve all params.");
  }
  const credentials = {
    clientId: params.find((p) => p.Name === clientIdParam)?.Value ?? "",
    clientSecret: params.find((p) => p.Name === clientSecretParam)?.Value ?? "",
    refreshToken: params.find((p) => p.Name === refreshTokenParam)?.Value ?? "",
  };
  if (
    !credentials.clientId ||
    !credentials.clientSecret ||
    !credentials.refreshToken
  ) {
    throw new Error("Failed to retrieve all credential values.");
  }
  console.log("Successfully fetched Strava credentials from SSM.");
  return credentials;
}

async function getBdtAuthToken(): Promise<string> {
  const paramName = process.env.BDT_AUTH_TOKEN_PARAM_NAME;
  if (!paramName) {
    throw new Error("Missing BDT_AUTH_TOKEN_PARAM_NAME environment variable.");
  }
  const command = new GetParameterCommand({
    Name: paramName,
    WithDecryption: true,
  });
  const { Parameter: param } = await ssmClient.send(command);
  if (!param?.Value) {
    throw new Error("Failed to retrieve BDT auth token from SSM.");
  }
  console.log("Successfully fetched BDT auth token from SSM.");
  return param.Value;
}

async function getStravaActivity(
  accessToken: string,
  activityId: string,
): Promise<StravaActivity> {
  const activityUrl = `https://www.strava.com/api/v3/activities/${activityId}`;
  try {
    const response = await axios.get<StravaActivity>(activityUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("Fetched Strava activity data:", response.data);
    return response.data;
  } catch (apiError) {
    const e = apiError as { response?: { data?: unknown }; message?: string };
    console.error(
      `Error fetching activity ${activityId} from Strava:`,
      e.response?.data || e.message,
    );
    throw apiError;
  }
}
