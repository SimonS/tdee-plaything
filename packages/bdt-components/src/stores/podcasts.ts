import { Podcast } from "@tdee/types/src/bdt";
import { atom } from "nanostores";

export const podcasts = atom<Podcast[]>([]);
