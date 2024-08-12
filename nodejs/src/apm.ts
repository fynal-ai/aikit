import Client from "./client";
import {
  agentGetResultArgType,
  agentRunArgType,
  agentResultConsumerIamAliveArgType,
} from "./types";

export default class ApmClass extends Client {
  apm_access_id: string;
  apm_access_key: string;
  apm_auth_status: boolean;
  apm_auth_token: string;

  constructor(apm_access_id: string, apm_access_key: string) {
    process.env.APM_SERVER ??
      (console.log("APM_SERVER is not set"), process.exit(1));
    super();
    this.axiosOptions.baseURL = process.env.APM_SERVER;
    this.apm_access_id = apm_access_id;
    this.apm_access_key = apm_access_key;
    this.apm_auth_status = false;
    this.apm_auth_token = "";

    this.apmAuth().then(() => {});
  }

  async apmAuth() {
    this.setHeader("Content-type", "application/json");
    const payload = {
      access_id: this.apm_access_id,
      access_key: this.apm_access_key,
    };
    console.log("AiKIT: APM auth start", payload);
    let response = await this.post("/apm/auth", payload);
    let authOK = false;
    if (response?.error) {
      console.error("AiKIT: APM auth failed: /apm/auth", payload);
    }else if(JSON.stringify(response).includes("error")) {
      console.error("AiKIT: APM auth failed: /apm/auth", payload);
    } else {
      authOK=true;
      this.apm_auth_status = true;
      this.apm_auth_token = response;
      this.setHeader("authorization", response);
      console.log(`AiKIT: APM auth success ${typeof response} ${JSON.stringify(response)} ${response.error}`);
    }
    if(!authOK) {
      setTimeout(() => {
        this.apmAuth();
      }, 1000);
    }
    return response;
  }

  async sleep(milliseconds: number) {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async waitApmAuth(times: number) {
    for (let i = 0; i < times; i++) {
      if (this.apm_auth_status) break;
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
    await this.waitApmAuth(10);
    let result = await this.post("/apm/agent/search", filter);

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }

  async agentDetail(payload: { name: string; version: string }) {
    await this.waitApmAuth(10);
    let result = await this.post("/apm/agent/detail", payload);

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }

  async agentAuth(name: string, arg1: string, arg2: string) {
    await this.waitApmAuth(10);
    let payload: Record<string, any> = {
      name,
      arg1,
      arg2,
    };
    let result = await this.post("/apm/agentservice/auth", payload);
    console.log("AgentAuth: ", result);

    if (result?.error) {
      console.log(payload);
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }

  async agentRun(arg: agentRunArgType) {
    await this.waitApmAuth(10);
    let payload: Record<string, any> = {
      name: arg.name,
      input: arg.input,
      access_token: arg.token ?? this.apm_auth_token,
      option: arg.option,
    };
    if (arg.runId) payload.runId = arg.runId;
    if (arg.version) payload.version = arg.version;
    let result = await this.post("/apm/agentservice/run", payload);

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }

  async agentResultConsumerIamAlive(arg: agentResultConsumerIamAliveArgType) {
    this.post("/apm/agentResultConsumer/iamalive", {
      access_token: arg.token ?? this.apm_auth_token,
      option: arg.option,
    });
  }

  async agentCheckResult(arg: agentGetResultArgType) {
    await this.waitApmAuth(10);
    if (arg.deleteAfter === undefined) {
      arg.deleteAfter = false;
    }
    let payload: Record<string, any> = {
      runId: arg.runId,
      deleteAfter: arg.deleteAfter,
      access_token: arg.token ?? this.apm_auth_token,
    };
    let result = await this.post("/apm/agentservice/result/get", payload);

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }

  async agentCleanResult(arg: agentGetResultArgType) {
    await this.waitApmAuth(10);
    let payload: Record<string, any> = {
      runId: arg.runId,
      access_token: arg.token ?? this.apm_auth_token,
    };
    let result = await this.post("/apm/agentservice/result/clean", payload);

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }
}
