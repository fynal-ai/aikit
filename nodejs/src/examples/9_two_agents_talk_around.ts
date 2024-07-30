import Fynal from "fynal";
import fs from "fs";
import { expect } from "@hapi/code";

process.env.AIKIT_HOME ??
  (console.log("AIKIT_HOME is not set"), process.exit(1));

Fynal.login("fynal_a", "FynalAI@2024")
  .then(async (result: any) => {
    if (result.error) {
      console.log(result);
    } else {
      let ret = await Fynal.putTemplate(
        fs.readFileSync(
          `${process.env.AIKIT_HOME}/templates/test_1_step.xml`,
          "utf8",
        ),
        "test_1_step",
        "Desc: 1 step workflow",
      );
      expect(ret.tplid).to.equal("test_1_step");
      expect(ret.desc).to.equal("Desc: 1 step workflow");

      Fynal.setLogLevel(3);
      ret = await Fynal.startWorkflow("test_1_step", "", "", "pbo_url");
      if (ret.error) {
        console.error(ret);
      } else {
        let wfid = ret.wfid;
        let pbo = await Fynal.getPbo(wfid, "text");
        expect(pbo[0].text).to.equal("pbo_url");
        let wl = await Fynal.getWorklist("fynal_a", { wfid: wfid }, 10);
        expect(wl.objs.length).to.equal(1);
        ret = await Fynal.doWork("fynal_a", wl.objs[0].todoid, {
          input_action1: "action1",
        });
        expect(ret.todoid).to.equal(wl.objs[0].todoid);
        wl = await Fynal.getWorklist("fynal_a", {
          wfid: wfid,
          status: "ST_RUN",
        });
        expect(wl.total).to.equal(0);
        for (let i = 0; i < 100; i++) {
          ret = await Fynal.getStatus(wfid);
          if (ret === "ST_DONE") {
            break;
          }
          await Fynal.sleep(3000);
        }
        expect(ret).to.equal("ST_DONE");
      }
    }
  })
  .catch((error: any) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
