export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONValue[];
export type JSONObject = { [member: string]: JSONValue };

export type BDTRequest = {
  access_token: string;
  bdt_endpoint: string;
  [propName: string]: JSONValue;
};

export interface PageInfo {
  endCursor: string;
  startCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
