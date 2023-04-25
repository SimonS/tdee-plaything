import React from "react";
import { allFormats } from "../stores/allFormats";

const Switcher = ({ data }: { data: any[] }) => {
  const changeFormat = (e: any): void => {
    const selected = data.filter((item) => item.dataName === e.target.value)[0];
    console.log(selected.store);
    allFormats.set({
      formatName: selected.dataName,
      grouped: selected.grouped,
      aggregated: selected.aggregated,
      store: selected.store,
    });
  };
  return (
    <select
      name="calendarSwitcher"
      id="calendarSwitcher"
      onChange={changeFormat}
    >
      {data.map((source, i) => (
        <option key={`cal-${i}`} value={source.dataName}>
          {source.dataName}
        </option>
      ))}
    </select>
  );
};

export default Switcher;
