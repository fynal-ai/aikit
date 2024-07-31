import Fynal from "fynal";
import fs from "fs";
import { expect } from "@hapi/code";

process.env.AIKIT_HOME ??
  (console.log("AIKIT_HOME is not set"), process.exit(1));

const remote_access_id = "lucas"; //remote_demo_user
const remote_access_key = "Jerome@99"; //remote_demo_password
Fynal.agentAuth("lucas/article1", remote_access_id, remote_access_key).then(
  (token: string) => {
    console.log("Token", token);
    Fynal.agentRun({
      name: "lucas/article1",
      input: {
        runId: "agent_process_0001", //if ignored, will return a auto-generated runId
        wftitle: "今天的文章流程",
      },
      token: token,
    })
      .then(async (result: any) => {
        if (result.error) {
          console.log(result);
        } else {
          console.log(result);
          console.log("Job submitted: ", result.runId);
          console.log(`You could get result from runId ${result.runId} later`);
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
              result = await Fynal.agentCheckResult({
                runId: result.runId,
                token,
              });
              console.log(i, result);
              break;
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
