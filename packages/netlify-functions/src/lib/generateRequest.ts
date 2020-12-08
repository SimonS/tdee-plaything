import { BDTRequest } from "@tdee/types/src/bdt";

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
