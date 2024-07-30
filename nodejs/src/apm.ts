import Client from "./client";

export default class ApmClass extends Client {
  access_id: string;
  access_key: string;
  authstatus: boolean;

  constructor(access_id: string, access_key: string) {
    process.env.APM_SERVER ??
      (console.log("APM_SERVER is not set"), process.exit(1));
    super();
    this.axiosOptions.baseURL = process.env.APM_SERVER;
    this.access_id = access_id;
    this.access_key = access_key;
    this.authstatus = false;

    this.auth(this.access_id, this.access_key).then(() => {});
  }

  async auth(access_id: any, access_key: string) {
    let theAccessId;
    let theAccessKey;
    if (typeof access_id === "string") {
      theAccessId = access_id;
      theAccessKey = access_key;
      if (!theAccessKey) {
        throw new Error("access_key should not be nullish");
      }
    } else if (
      access_id.hasOwnProperty("access_id") &&
      (access_id.hasOwnProperty("access_key") ||
        access_id.hasOwnProperty("access_key"))
    ) {
      theAccessId = access_id.access_id;

      if (access_id.hasOwnProperty("access_key"))
        theAccessKey = access_id.access_key;
      else if (access_id.hasOwnProperty("access_key"))
        theAccessKey = access_id.access_key;
      else {
        throw new Error("access_key should not be nullish");
      }
    }

    this.setHeader("Content-type", "application/json");
    const payload = {
      access_id: theAccessId,
      access_key: theAccessKey,
    };
    let response = await this.post("/apm/auth", payload);
    if (response.access_token) {
      this.authstatus = true;
      this.setHeader("authorization", response.access_token);
      console.log("APM auth success");
    } else {
      console.error("Failed: /apm/auth", payload);
    }
    return response;
  }

  async sleep(miliseconds: number) {
    await new Promise((resolve) => setTimeout(resolve, miliseconds));
  }

  async waitAuth(times: number) {
    for (let i = 0; i < times; i++) {
      if (this.authstatus) break;
      await this.sleep(500);
    }
  }

  async agentSearch(
    filter: {
      hastotal: boolean;
      extrajson: Record<string, any>;
      skip: number;
      limit: number;
      sortBy: Record<string, number>;
      q: string;
    } = {
      hastotal: false,
      extrajson: {},
      skip: 0,
      limit: 32,
      sortBy: {
        updatedAt: -1,
      },
      q: "",
    },
  ) {
    await this.waitAuth(10);
    let result = await this.post("/apm/agent/search", filter);

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }

  async agentDetail(name: string, version: string) {
    await this.waitAuth(10);
    let filter: Record<string, any> = { name };
    if (version) filter.version = version;
    let result = await this.post("/apm/agent/detail", filter);

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }

  async agentRun(
    name: string,
    input: Record<string, any>,
    runId: string,
    version: string,
  ) {
    await this.waitAuth(10);
    let filter: Record<string, any> = { name, input };
    if (runId) filter.runId = runId;
    if (version) filter.version = version;
    let result = await this.post("/apm/agentservice/run", filter);

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }

  async agentCheckResult(runId: string, deleteAfter: boolean = false) {
    await this.waitAuth(10);
    let filter: Record<string, any> = { runId, deleteAfter };
    let result = await this.post("/apm/agentservice/result/get", filter);

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }
}
