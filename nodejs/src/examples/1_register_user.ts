import Fynal from "fynal";

Fynal.register("user1", "John Doe", "Jerome@99")
  .then((result: any) => {
    console.log(result);
  })
  .catch((error: any) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
