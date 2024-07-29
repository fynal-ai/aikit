import Fynal from "fynal";

Fynal.login("fynal_a", "FynalAI@2024")
  .then((result: any) => {
    console.log(result);
  })
  .catch((error: any) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
