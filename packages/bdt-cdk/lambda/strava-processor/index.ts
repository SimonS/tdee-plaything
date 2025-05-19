import { SQSEvent, SQSRecord } from "aws-lambda";
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

import axios from "axios";

const ssmClient = new SSMClient({});

interface StravaCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log(`Processor Lambda invoked with ${event.Records.length} record.`);

  let accessToken: string;
  try {
    accessToken = await getStravaAccessToken();
    console.log("Access token refreshed.");
  } catch (error) {
    console.error("Error refreshing access token:", error);
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
        
        const stravaData = await getStravaActivity(accessToken, object_id);
        const wpPayload = stravaToWordpress(stravaData);
        
        console.log("WordPress data prepared:", wpPayload);
      } else {
        console.log(
          `Ignoring message for object_type ${object_type}, aspect_type ${aspect_type}`
        );
      }
    } catch (error) {
      console.error(`Error processing SQS message ${record.messageId}:`, error);
    }
  }

  console.log("Processing complete.");
};

function stravaToWordpress(stravaData: any) {
  return {
    title: stravaData.name || `Strava Activity ${stravaData.id}`,
    content: stravaData.description || "",
    status: "publish",
    date_gmt: stravaData.start_date
      ? new Date(stravaData.start_date).toISOString().slice(0, 19)
      : undefined,
    meta: {
      source_platform: "strava",
      source_id: stravaData.id,
      activity_type: stravaData.type || null,
      distance_meters: stravaData.distance || null,
      moving_time_seconds: stravaData.moving_time || null,
      elapsed_time_seconds: stravaData.elapsed_time || null,
      total_elevation_gain_meters: stravaData.total_elevation_gain || null,
      start_date_local_iso: stravaData.start_date_local || null,
      map_summary_polyline: stravaData.map?.summary_polyline || null,
      _raw_data_json: JSON.stringify(stravaData),
    },
  };
}

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
  } catch (error: any) {
    console.error(
      "Error refreshing Strava token:",
      error.response?.data || error.message
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
      "FATAL: Missing required SSM parameter name environment variables (STRAVA_CLIENT_ID_PARAM_NAME, STRAVA_SECRET_PARAM_NAME, STRAVA_REFRESH_TOKEN_PARAM_NAME)."
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
    clientId: params.find((p) => p.Name === clientIdParam)?.Value!,
    clientSecret: params.find((p) => p.Name === clientSecretParam)?.Value!,
    refreshToken: params.find((p) => p.Name === refreshTokenParam)?.Value!,
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

async function getStravaActivity(
  accessToken: string,
  activityId: string
): Promise<any> {
  const activityUrl = `https://www.strava.com/api/v3/activities/${activityId}`;
  try {
    const response = await axios.get(activityUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("Fetched Strava activity data:", response.data);
    return response.data;
  } catch (apiError: any) {
    console.error(
      `Error fetching activity ${activityId} from Strava:`,
      apiError.response?.data || apiError.message
    );
    throw apiError;
  }
}
