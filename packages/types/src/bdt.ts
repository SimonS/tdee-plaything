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

export interface Podcast {
  listenDate: string;
  podcastTitle: string;
  content: string;
  overcastURL: string;
  feedURL: string;
  episodeURL: string;
  feedTitle: string;
  feedImage: string;
}

export interface WPPage {
  id: string;
  title: string;
  content: string;
  slug: string;
}

export interface Film {
  watchedDate: string;
  filmTitle: string;
  year: number;
  rating: number;
  reviewLink: string;
  content: string;
  meta: {
    image: string;
    runtime: number;
    original_language: string;
  };
}

export interface Weighin {
  weighinTime: string;
  weight: number;
  bodyFatPercentage: number;
}

export type CalculatedWeighin = Weighin & { weightTrend: number };
