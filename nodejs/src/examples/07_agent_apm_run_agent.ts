import Fynal from "fynal";
import fs from "fs";
import { expect } from "@hapi/code";

process.env.AIKIT_HOME ??
  (console.log("AIKIT_HOME is not set"), process.exit(1));

Fynal.agentRun({
  name: "fynal-ai/flood_control",
  input: {
    prompt: "潘家塘最大降雨量多少？",
    start_time: 1715961600,
    end_time: 1721364927,
  },
})
  .then(async (result: any) => {
    if (result.error) {
      console.log(result);
    } else {
      if (result.runMode === "sync") {
        console.log(result.output);
      } else {
        console.log("Job submitted: ", result.runId);
        console.log(`You could get result from runId ${result.runId} later`);
      }
    }
  })
  .catch((error: any) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
