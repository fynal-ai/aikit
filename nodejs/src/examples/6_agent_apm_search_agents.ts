import Fynal from "fynal";
import fs from "fs";
import { expect } from "@hapi/code";

process.env.AIKIT_HOME ??
  (console.log("AIKIT_HOME is not set"), process.exit(1));

Fynal.agentSearch({ limit: 1 })
  .then(async (result: any) => {
    if (result.error) {
      console.log(result);
    } else {
      console.log(result);
      result.map((item: any) => {
        console.log(item.name);
        Fynal.agentDetail(item.name).then((detail: any) => {
          console.log("Detail of ", item.name, detail);
        });
      });
    }
  })
  .catch((error: any) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
