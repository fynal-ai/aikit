import Fynal from "fynal";
import fs from "fs";
import { expect } from "@hapi/code";

process.env.AIKIT_HOME ??
  (console.log("AIKIT_HOME is not set"), process.exit(1));

Fynal.agentRun("fynal-ai/draw_image", {
  style: "水墨画",
  prompt: "君不见，黄河之水天上来，奔流到海不复回",
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
        for (let i = 0; i < 100; i++) {
          await new Promise((r) => setTimeout(r, 1000));
          result = await Fynal.agentCheckResult(result.runId);
          if (result.status?.done) {
            console.log(result.output);
            break;
          }
        }
      }
    }
  })
  .catch((error: any) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
