import { Film } from "@tdee/types/src/bdt";
import { atom } from "nanostores";

export const films = atom<{ selected?: string; films: Film[] }>({
  films: [],
});
