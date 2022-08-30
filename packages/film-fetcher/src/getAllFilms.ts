import { Film } from "@tdee/types/src/bdt";
import getFilms from "./getFilms";

const getAllFilms = async () => (await getFilms()).films;

export default getAllFilms;
