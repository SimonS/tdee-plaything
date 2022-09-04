import React from "react";

import { useStore } from "@nanostores/react";
import { films as filmsStore } from "../stores/films";

export const Films = (): JSX.Element => {
  const { films, selected } = useStore(filmsStore);

  if (selected === undefined)
    return <p>Click a date to show films watched that day</p>;

  return <div />;
};

export default Films;
