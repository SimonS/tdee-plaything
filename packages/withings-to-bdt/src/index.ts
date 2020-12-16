import csv from "csv-parser";
import dateformat from "dateformat";
import { createReadStream } from "fs";
import { postToBDT } from "@tdee/netlify-functions/src/lib/postToBDT";

type WithingsWeighin = {
  weighin_time: string;
  weight: number;
  body_fat_percentage: number;
};

const filename = process.argv.slice(2)[0];

if (!filename) {
  process.stdout.write("Please include a filename to read from.");
  process.exitCode = 1;
}

const before = new Date(process.argv.slice(3)[0]);
const after = new Date(process.argv.slice(4)[0]);

const results: WithingsWeighin[] = [];
const fails: WithingsWeighin[] = [];

createReadStream(filename)
  .pipe(csv())
  .on("data", (data) => {
    if (!(data["Weight (kg)"] && data["Fat mass (kg)"])) {
      return;
    }
    const weighinTime = dateformat(
      new Date(data["Date"]),
      'mmmm dd, yyyy "at" hh:MMTT'
    );
    const weight = parseInt(data["Weight (kg)"], 10);

    if (!isNaN(before.getTime()) && before > new Date(data["Date"])) {
      if (!isNaN(after.getTime()) && after < new Date(data["Date"])) {
        const newWeighIn: WithingsWeighin = {
          weighin_time: weighinTime,
          weight,
          body_fat_percentage:
            (parseInt(data["Fat mass (kg)"], 10) / weight) * 100,
        };
        results.push(newWeighIn);
      }
    }
  })
  .on("end", async () => {
    await Promise.all(
      results.map(async (weighIn) => {
        try {
          await postToBDT(
            JSON.stringify({ meta: weighIn, status: "publish" }),
            "https://breakfastdinnertea.co.uk/wp-json/wp/v2/bdt_weighin",
            "ACCESS TOKEN"
          );
        } catch (e) {
          fails.push(weighIn);
        }
      })
    ).then(() => {
      console.log("all done");
      console.log("fails:");
      console.log(fails);
    });
  });
