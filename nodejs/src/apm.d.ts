//User 1: agent developer
//User 2: agent store administrator
interface agentDefItf {
  author: string;
  name: string;
  version: string;
  description: string;
  doc: string;
  icon: string;
  label: string;
  executor: "node" | "python" | "remote";
  config: {
    input: Record<string, any>;
    output: Record<string, any>;
  };
  status?:
    | "activate"
    | "in_use"
    | "expired"
    | "suspended"
    | "cancelled"
    | "overdue";
  price?: { original: number; discount: number };
  validity?: {
    validityType: "forever" | "limited";
    quantity: number;
    unit: "hour" | "day" | "week" | "month" | "year";
  };
  costType?: "trial" | "subscription" | "gift";
}

interface localRunAgentType extends agentDefItf {
  pkgId: string;
}

//protocol: 协议
interface remoteRunAgentType extends agentDefItf {
  endpoints: {
    site: string;
    auth: string; //https://myserver.com/agent/auth
    authType: "user" | "idandkey" | "keyonly";
    //user: { username & password}
    //idandkey: { access_id & access_key}
    //keyonly: { access_key}
    //APP中调用APM的auth接口， APM.auth接口根据name查看是那种类型的agent， 如果是 node/python,则用当前的代码
    //如果是remote, 就调用endpoints.auth
    run: string; //https://myserver.com/agent/run -> https://apm.baystoneai.com/apm/agentservice/run
    getresult: string;
    cleanresult: string;
  };
}

interface agentRunArgType {
  name: string;
  version?: string;
  runId?: string;
  input: Record<string, any>;
  token?: string;
}

interface agentGetResultArgType {
  runId: string;
  deleteAfter: boolean;
  token: string;
}

export { agentRunArgType, agentGetResultArgType };
