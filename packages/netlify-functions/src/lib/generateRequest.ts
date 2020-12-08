import { BDTRequest } from "@tdee/types/src/bdt";

// payload, strips out access token and endpoint and returns each aspect separated
const generateRequest = ({
  access_token: authToken,
  bdt_endpoint: endpoint,
  ...body
}: BDTRequest): { authToken: string; endpoint: string; body: string } => ({
  authToken,
  endpoint: `https://breakfastdinnertea.co.uk${endpoint}`,
  body: JSON.stringify(body),
});

export default generateRequest;
