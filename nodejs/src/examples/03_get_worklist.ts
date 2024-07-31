import Fynal from "fynal";

Fynal.login("fynal_a", "FynalAI@2024")
  .then(async (result: any) => {
    const wl = await Fynal.getWorklist("fynal_a", 10);
    console.log(wl);
  })
  .catch((error: any) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
