import Fynal from "fynal";
import fs from "fs";
import { expect } from "@hapi/code";

process.env.AIKIT_HOME ??
  (console.log("AIKIT_HOME is not set"), process.exit(1));

Fynal.agentRun("a")
  .then(async (result: any) => {
    if (result.error) {
      console.log(result);
    } else {
      console.log(result);
    }
  })
  .catch((error: any) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
