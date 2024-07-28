import Fynal from "fynal";

Fynal.login("user1", "John Doe")
  .then((result: any) => {
    console.log(result);
  })
  .catch((error: any) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
