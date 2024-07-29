import Fynal from "fynal";

Fynal.register("fynal_a", "John Doe", "FynalAI@2024")
  .then((result: any) => {
    console.log(result);
  })
  .catch((error: any) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
