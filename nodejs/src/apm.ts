import Client from "./client";

export default class ApmClass extends Client {
  username: string;
  passwd: string;
  loginstatus: boolean;

  constructor(username: string, passwd: string) {
    process.env.APM_SERVER ??
      (console.log("APM_SERVER is not set"), process.exit(1));
    super();
    this.axiosOptions.baseURL = process.env.APM_SERVER;
    this.username = username;
    this.passwd = passwd;
    this.loginstatus = false;

    this.login(this.username, this.passwd).then(() => {});
  }

  async login(account: any, password: string) {
    let theAccount;
    let thePassword;
    if (typeof account === "string") {
      theAccount = account;
      thePassword = password;
      if (!thePassword) {
        throw new Error("password should not be nullish");
      }
    } else if (
      account.hasOwnProperty("account") &&
      (account.hasOwnProperty("passwd") || account.hasOwnProperty("password"))
    ) {
      theAccount = account.account;

      if (account.hasOwnProperty("passwd")) thePassword = account.passwd;
      else if (account.hasOwnProperty("password"))
        thePassword = account.password;
      else {
        throw new Error("password should not be nullish");
      }
    }

    this.setHeader("Content-type", "application/json");
    let response = await this.post("/account/login", {
      account: theAccount,
      password: thePassword,
    });
    if (response.sessionToken) {
      this.loginstatus = true;
      this.setHeader("authorization", response.sessionToken);
      console.log("APM login success");
    }
    return response;
  }

  async sleep(miliseconds: number) {
    await new Promise((resolve) => setTimeout(resolve, miliseconds));
  }

  async waitLogin(times: number) {
    for (let i = 0; i < times; i++) {
      if (this.loginstatus) break;
      await this.sleep(500);
    }
  }

  async agentSearch(q: string, limit: number) {
    await this.waitLogin(10);
    let result = await this.post("/apm/agent/search", {
      hastotal: false,
      extrajson: {},
      skip: 0,
      limit: limit,
      sortBy: {
        updatedAt: -1,
      },
      q: q,
    });

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }

  async agentDetail(name: string, version: string) {
    await this.waitLogin(10);
    let filter: Record<string, any> = { name };
    if (version) filter.version = version;
    let result = await this.post("/apm/agent/detail", filter);

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }

  async agentRun(name: string, runId: string, version: string) {
    await this.waitLogin(10);
    let filter: Record<string, any> = { name };
    if (runId) filter.runId = runId;
    if (version) filter.version = version;
    let result = await this.post("/apm/agentservice/run", filter);

    if (typeof result === "object" && result.error) {
      console.log(result);
      throw new Error(result.error);
    } else return result; // Resolve the promise with the result
  }
}
