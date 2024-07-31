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
      const ret = await Fynal.putTemplate(
        fs.readFileSync(
          `${process.env.AIKIT_HOME}/templates/test_and_or.xml`,
          "utf8",
        ),
        "test_and_or",
        "Desc: Test And Or Logic",
      );
      expect(ret.tplid).to.equal("test_and_or");
      expect(ret.desc).to.equal("Desc: Test And Or Logic");
    }
  })
  .catch((error: any) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
