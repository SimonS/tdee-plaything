import csv from "csv-parser";
import { createReadStream } from "fs";

type WithingsWeighin = {
  weighinTime: Date;
  weight: number;
  bodyFatPercentage: number;
};

const filename = process.argv.slice(2)[0];

if (!filename) {
  process.stdout.write("Please include a filename to read from.");
  process.exitCode = 1;
}

const results: WithingsWeighin[] = [];
createReadStream(filename)
  .pipe(csv())
  .on("data", (data) => {
    if (!("Date" in data && "Weight (kg)" in data && "Fat mass (kg)" in data)) {
      return;
    }
    const weight = parseInt(data["Weight (kg)"], 10);
    const newWeighIn: WithingsWeighin = {
      weighinTime: new Date(data["Date"]),
      weight: weight,
      bodyFatPercentage: (parseInt(data["Fat mass (kg)"], 10) / weight) * 100,
    };
    results.push(newWeighIn);
  })
  .on("end", () => {
    console.log(results);
  });
