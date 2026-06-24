import { atom } from "nanostores";

export const allFormats = atom<any>({
  formatName: "",
  grouped: {},
  aggregated: [],
});
