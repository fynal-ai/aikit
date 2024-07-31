import Fynal from "fynal";
import fs from "fs";
import { expect } from "@hapi/code";

process.env.AIKIT_HOME ??
  (console.log("AIKIT_HOME is not set"), process.exit(1));

const remote_access_id = "apm_test"; //remote_demo_user
const remote_access_key = "!#S3YN49HDWcedVyAW"; //remote_demo_password
Fynal.agentAuth("jobsimi/draw-image", remote_access_id, remote_access_key).then(
  (token: string) => {
    console.log("Token", token);
    Fynal.agentRun({
      name: "jobsimi/draw-image",
      input: {
        style: "水墨画",
        prompt: "君不见，黄河之水天上来，奔流到海不复回",
      },
      token: token,
    })
      .then(async (result: any) => {
        if (result.error) {
          console.log(result);
        } else {
          console.log(result);
          if (result.runMode === "sync") {
            console.log(result.output);
          } else {
            console.log("Job submitted: ", result.runId);
            console.log(
              `You could get result from runId ${result.runId} later`,
            );
            for (let i = 0; i < 100; i++) {
              await new Promise((r) => setTimeout(r, 1000));
              result = await Fynal.agentCheckResult({
                runId: result.runId,
                token: token,
              });
              console.log(i, result);
              if (["ST_DONE", "ST_FAIL"].includes(result.status)) {
                await Fynal.agentCleanResult({
                  runId: result.runId,
                  token: token,
                });
                console.log("======= Next Error is on purpose ======");
                result = await Fynal.agentCheckResult({
                  runId: result.runId,
                  token,
                });
                console.log(i, result);
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
  },
);
