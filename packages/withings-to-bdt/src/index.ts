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

const before = new Date(process.argv.slice(3)[0]);

const results: WithingsWeighin[] = [];
createReadStream(filename)
  .pipe(csv())
  .on("data", (data) => {
    if (!(data["Weight (kg)"] && data["Fat mass (kg)"])) {
      return;
    }
    const weighinTime = new Date(data["Date"]);
    const weight = parseInt(data["Weight (kg)"], 10);

    if (!isNaN(before.getTime()) && before > weighinTime) {
      const newWeighIn: WithingsWeighin = {
        weighinTime,
        weight,
        bodyFatPercentage: (parseInt(data["Fat mass (kg)"], 10) / weight) * 100,
      };
      results.push(newWeighIn);
    }
  })
  .on("end", () => {
    console.log(results.length);

    // at this point we start posting the 311 results to BDT, reusing the netlify logic
  });
