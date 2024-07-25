const axios = require("axios").default;
interface AxiosOptions {
  debug: boolean;
  baseURL: string;
  timeout: number;
  headers: { [key: string]: any };
  responseType: string;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxBodyLength: number;
  maxRedirects: number;
}

const Fynal = {
  token: "",
  apiServer: "https://api.aiwork.localhost",
  sleep: async function (miliseconds: number) {
    await new Promise((resolve) => setTimeout(resolve, miliseconds));
  },
  debug: function (flag: boolean) {
    Fynal.axiosOptions.debug = flag;
  },
  axiosOptions: {
    debug: false,
    baseURL: "",
    timeout: 3000,
    headers: {} as { [key: string]: any },
    responseType: "json",
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxBodyLength: 20000,
    maxRedirects: 3,
  } as AxiosOptions,

  setHeader: function (k: string, v: any) {
    Fynal.axiosOptions.headers[k] = v;
  },

  setHttpTimeout: function (v: number) {
    Fynal.axiosOptions.timeout = v;
  },

  post: async function (uri: string, payload: Record<string, any> = {}) {
    payload = payload ?? {};
    if (Fynal.axiosOptions.debug) console.log("post", uri, payload);
    let ret = await Fynal._post(uri, payload);
    return ret?.data;
  },
  //return full response body.
  _post: async function (endpoint: string, payload: Record<string, any>) {
    try {
      let res = await axios.post(endpoint, payload, Fynal.axiosOptions);
      return res;
    } catch (err: any) {
      if (err.response) return err.response;
      else return { data: { error: err.message } };
    }
  },
  _download: async function (uri: string, payload: Record<string, any>) {
    await axios.post(uri, payload, Fynal.axiosOptions);
  },
  get: async function (uri: string) {
    let ret = await Fynal._get(uri);
    if (ret && ret.data) return ret.data;
    else {
      console.log(uri);
      console.log(ret);
    }
  },

  _get: async function (uri: string) {
    try {
      let ret = await axios.get(uri, Fynal.axiosOptions);
      return ret;
    } catch (error: any) {
      return error.response;
    }
  },
  setServer: function (url: string) {
    Fynal.axiosOptions.baseURL = url;
  },

  getWorklist: async function (doer: string, arg1: any, arg2: any) {
    let filter = {};
    let repeatTimesUntilGotOne = 1;
    if (arg1 && !arg2) {
      if (typeof arg1 === "number") {
        repeatTimesUntilGotOne = arg1;
      } else {
        filter = arg1;
      }
    } else if (arg1 && arg2) {
      if (typeof arg1 === "number") {
        repeatTimesUntilGotOne = arg1;
        filter = arg2;
      } else {
        repeatTimesUntilGotOne = arg2;
        filter = arg1;
      }
    }

    let res;
    filter = filter ? filter : {};
    for (let i = 0; i < repeatTimesUntilGotOne; i++) {
      res = await Fynal.post("/work/search", {
        doer: doer,
        ...filter,
      });
      if (!res) {
        throw new Error("EMP server response is nullish");
      }
      if (res.total > 0) break;
      else if (repeatTimesUntilGotOne > 1) {
        await Fynal.sleep(1000);
      }
    }
    return res;
  },

  createTemplate: async function (tplid: string, desc = "") {
    let ret = await Fynal.post("/template/create", { tplid: tplid, desc });
    return ret;
  },

  putTemplate: async function (tpl_data: string, tplid: string, desc = "") {
    if (!tplid) throw new Error("Tplid must be provided");
    let ret = await Fynal.post("/template/put", {
      doc: tpl_data,
      tplid,
      forceupdate: true,
      desc,
    });
    return ret;
  },

  importTemplateXML: async function (tplid: string, fileObj: any) {
    var formData = new FormData();
    formData.append("tplid", tplid);
    formData.append("file", fileObj, fileObj.name);
    let option = Fynal.axiosOptions;
    let token = this.getSessionToken();
    if (token === null) {
      console.error("No session token in localStorage");
      return;
    }
    option.headers = {
      "Content-Type": "multipart/form-data",
      authorization: token,
    };
    let res = await axios.post("/template/import", formData, option);
    return res;
  },

  readTemplate: async function (tpl_id: string) {
    let ret = await Fynal.post("/template/read", {
      tplid: tpl_id,
    });
    return ret;
  },
  readWorkflow: async function (wfid: string) {
    let ret = await Fynal.post("/workflow/read", {
      wfid: wfid,
    });
    return ret;
  },
  exportTemplate: async function (tpl_id: string) {
    let tmpOption = Fynal.axiosOptions;
    tmpOption.responseType = "blob";
    axios
      .post(
        "/template/download",
        {
          tplid: tpl_id,
        },
        tmpOption,
      )
      .then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        $(".tempLink").remove();
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${tpl_id}.xml`);
        link.setAttribute("class", "tempLink");
        document.body.appendChild(link);
        //点击这个临时连接实现内容下载
        link.click();
      });
  },

  listTemplate: async function () {
    let ret = await Fynal.get("/template/list");
    return ret;
  },

  //Rename with internal _id
  renameTemplateWithIid: async function (_id: string, tplid: string) {
    let ret = await Fynal.post("/template/renamewithiid", {
      _id: _id,
      tplid: tplid,
    });
    return ret;
  },

  renameTemplate: async function (fromid: string, tplid: string) {
    let ret = await Fynal.post("/template/rename", {
      fromid: fromid,
      tplid: tplid,
    });
    return ret;
  },

  deleteTemplate: async function (_id: string) {
    let ret = await Fynal.post("/template/delete", {
      _id: _id,
    });
    return ret;
  },

  deleteTemplateByTplid: async function (tplid: string) {
    let ret = await Fynal.post("/template/delete/by/tplid", {
      tplid: tplid,
    });
    return ret;
  },

  makeCopyOfTemplate: async function (_id: string) {
    let ret = await Fynal.post("/template/makecopy", {
      _id: _id,
    });
    return ret;
  },

  copyTemplateTo: async function (fromid: string, tplid: string) {
    let ret = await Fynal.post("/template/copyto", {
      fromid: fromid,
      tplid: tplid,
    });
    return ret;
  },
  getPbo: async function (wfid: string, pbotype = "text") {
    let ret = await Fynal.post("/workflow/get/pbo", {
      wfid: wfid,
      pbotype: pbotype,
    });
    return ret;
  },
  setPbo: async function (
    wfid: string,
    pbo: string,
    pbotype: string,
    stepid: string,
  ) {
    let ret = await Fynal.post("/workflow/set/pbo", {
      wfid: wfid,
      pbo: pbo,
      pbotype: pbotype,
      stepid: stepid,
    });
    return ret;
  },

  startWorkflow: async function (
    tplid: string,
    wfid: string,
    teamid = "",
    pbo = "",
    kvars = {},
  ) {
    let ret = await Fynal.post("/workflow/start", {
      tplid: tplid,
      wfid: wfid,
      teamid: teamid,
      textPbo: pbo,
      kvars: kvars,
    });
    return ret;
  },

  opWorkflow: async function (wfid: string, op: string) {
    return await Fynal.post("/workflow/op", { wfid, op });
  },

  pauseWorkflow: async function (wfid: string) {
    let ret = await Fynal.post("/workflow/pause", {
      wfid: wfid,
    });
    return ret;
  },

  resumeWorkflow: async function (wfid: string) {
    let ret = await Fynal.post("/workflow/resume", {
      wfid: wfid,
    });
    return ret;
  },
  stopWorkflow: async function (wfid: string) {
    let ret = await Fynal.post("/workflow/stop", {
      wfid: wfid,
    });
    return ret;
  },

  workflowSearch: async function (filter: Record<string, any>) {
    let ret = await Fynal.post("/workflow/search", filter);
    return ret;
  },

  workflowGetLatest: async function (filter: Record<string, any>) {
    let ret = await Fynal.post("/workflow/latest", {
      filter: filter,
    });
    return ret;
  },

  destroyWorkflow: async function (wfid: string) {
    let ret = await Fynal.post("/workflow/destroy", { wfid: wfid });
    return ret;
  },
  destroyMultiWorkflows: async function (wfids: string[]) {
    let ret = await Fynal.post("/workflow/destroy/multi", { wfids });
    return ret;
  },
  destroyWorkflowByWfTitle: async function (wftitle: string) {
    let ret = await Fynal.post("/workflow/destroy/by/title", { wftitle });
    return ret;
  },
  destroyWorkflowByTplid: async function (tplid: string) {
    let ret = await Fynal.post("/workflow/destroy/by/tplid", { tplid });
    return ret;
  },

  doWork: async function (
    doer: string,
    todoid: string,
    kvars = {},
    route = "DEFAULT",
  ) {
    let ret = await Fynal.post("/work/do", {
      doer: doer,
      todoid: todoid,
      route: route,
      kvars: kvars,
    });
    return ret;
  },
  //根据wfid， 和nodeid，执行wfid里的一个nodeid的todo
  doWorkByNode: async function (
    doer: string,
    wfid: string,
    nodeid: string,
    kvars = {},
    route = "DEFAULT",
  ) {
    let ret = await Fynal.post("/work/do/bynode", {
      doer: doer,
      wfid: wfid,
      nodeid: nodeid,
      route: route,
      kvars: kvars,
    });
    return ret;
  },

  getKVars: async function (wfid: string, workid: string) {
    let ret = await Fynal.post(
      "/workflow/kvars",
      workid
        ? {
            wfid: wfid,
            workid: workid,
          }
        : {
            wfid: wfid,
          },
    );
    return ret;
  },

  getStatus: async function (wfid: string, todoid: string) {
    let ret = "ST_UNKNOWN";
    if (todoid)
      ret = await Fynal.post("/work/status", {
        wfid: wfid,
        todoid: todoid,
      });
    else
      ret = await Fynal.post("/workflow/status", {
        wfid: wfid,
      });

    return ret;
  },

  revoke: async function (wfid: string, todoid: string) {
    let ret = await Fynal.post("/work/revoke", {
      tenant: Fynal.tenant,
      wfid: wfid,
      todoid: todoid,
    });
    return ret;
  },

  sendback: async function (
    doer: string,
    wfid: string,
    todoid: string,
    kvars = {},
  ) {
    let ret = await Fynal.post("/work/sendback", {
      doer: doer,
      wfid: wfid,
      todoid: todoid,
      kvars,
    });
    return ret;
  },

  getWorkInfo: async function (wfid: string, todoid: string) {
    let ret = await Fynal.post("/work/info", {
      todoid: todoid,
    });

    return ret;
  },

  uploadTeam: async function (name: string, tmap: string) {
    let payload = { teamid: name, tmap: tmap };
    let ret = await Fynal.post("/team/upload", payload);
    return ret;
  },
  setRole: async function (teamid: string, role: string, members: string[]) {
    let payload = { teamid: teamid, role: role, members: members };
    let ret = await Fynal.post("/team/role/set", payload);
    return ret;
  },
  addRoleMembers: async function (
    teamid: string,
    role: string,
    members: string[],
  ) {
    let payload = { teamid: teamid, role: role, members: members };
    let ret = await Fynal.post("/team/role/member/add", payload);
    return ret;
  },
  deleteRoleMembers: async function (
    teamid: string,
    role: string,
    members: string[],
  ) {
    let payload = { teamid: teamid, role: role, eids: members };
    let ret = await Fynal.post("/team/role/member/delete", payload);
    return ret;
  },
  copyRole: async function (teamid: string, role: string, newrole: string) {
    let payload = { teamid: teamid, role: role, newrole: newrole };
    let ret = await Fynal.post("/team/role/copy", payload);
    return ret;
  },
  importTeamCSV: async function (teamid: string, fileObj: any) {
    if (this.isEmpty(teamid)) return;
    var formData = new FormData();
    formData.append("teamid", teamid);
    formData.append("file", fileObj, fileObj.name);
    let option = Fynal.axiosOptions;
    let token = this.getSessionToken();
    if (token === null) {
      console.error("No session token in localStorage");
      return;
    }
    option.headers = {
      "Content-Type": "multipart/form-data",
      authorization: token,
    };
    let res = await axios.post("/team/import", formData, option);
    return res;
  },

  getTeamFullInfo: async function (teamid: string) {
    let ret = await Fynal.get(`/team/fullinfo/${teamid}`);
    return ret;
  },

  getTeamList: async function (payload: Record<string, any>) {
    payload = payload ? payload : { limit: 1000 };
    ret = await Fynal.post("/team/search", payload);
    return ret;
  },

  getCallbackPoints: async function (cbpFilter: Record<string, any>) {
    let ret = await Fynal.post("/workflow/cbps", cbpFilter);
    return ret;
  },

  getLatestCallbackPoint: async function (cbpFilter: Record<string, any>) {
    let ret = await Fynal.post("/workflow/cbps/latest", cbpFilter);
    return ret;
  },

  doCallback: async function (
    cbpid: string,
    decision: string,
    kvars: any,
    atts: any,
  ) {
    let payload: any = { cbpid, decision };
    if (kvars) {
      payload.kvars = kvars;
      if (atts) {
        payload.atts = atts;
      }
    }
    let ret = await Fynal.post("/workflow/docallback", payload);
    return ret;
  },

  deleteTeam: async function (name: string) {
    let payload = { teamid: name };
    let ret = await Fynal.post("/team/delete", payload);
    return ret;
  },

  __checkError: function (ret: any) {
    if (ret.errors) {
      throw new Error(ret.errors);
    }
  },

  register: async function (
    account: string,
    username: string,
    password: string,
  ) {
    Fynal.setHeader("Content-type", "application/json");
    let endpoint = "/account/register";
    let payload = {
      account: account,
      username: username,
      password: password,
    };
    let response = await Fynal.post(endpoint, payload);
    //console.error("=============== Regsiter Response =====");
    //console.error(response);
    //console.error("=============== Regsiter Response =====");
    if (response?.sessionToken) {
      Fynal.setHeader("authorization", response.sessionToken);
    }
    return response;
  },
  verify: async function (token: string) {
    let response = await Fynal.post("/account/verifyEmail", { token });
    return response;
  },
  removeUser: async function (account: string, site_passwd: string) {
    let ret = await Fynal.post("/admin/remove/account", {
      account: account,
      password: site_passwd,
    });

    return ret;
  },

  login: async function (account: any, password: string) {
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

    Fynal.setHeader("Content-type", "application/json");
    let response = await Fynal.post("/account/login", {
      account: theAccount,
      password: thePassword,
    });
    if (response.sessionToken) {
      Fynal.setHeader("authorization", response.sessionToken);
    }
    return response;
  },

  setUserName: async function (username: string) {
    Fynal.setHeader("Content-type", "application/json");
    let response = await Fynal.post("/account/set/username", {
      username,
    });
    return response;
  },

  setUserPassword: async function (oldpassword: string, password: string) {
    Fynal.setHeader("Content-type", "application/json");
    let response = await Fynal.post("/account/set/password", {
      oldpassword,
      password,
    });
    return response;
  },

  getSessionToken: function () {
    if (localStorage) {
      let token = localStorage.getItem("sessionToken");
      if (token) {
        return `Bearer ${token}`;
      } else {
        return null;
      }
    } else {
      return null;
    }
  },
  setSessionToken: function (token: string) {
    if (token) {
      //console.log("Fynal authorization token", token);
      Fynal.setHeader("authorization", `Bearer ${token}`);
    } else {
      if (localStorage) {
        let token = localStorage.getItem("sessionToken");
        if (token) {
          Fynal.setHeader("authorization", `Bearer ${token}`);
          //console.log("Fynal authorization token", token);
        }
      }
    }
  },

  profile: async function () {
    let response = await Fynal.get("/account/profile/me");
    return response;
  },

  logout: async function (token: string) {
    if (token) {
      Fynal.setHeader("authorization", token);
    }
    let response = await Fynal.post("/account/logout", {});
    return response;
  },

  adminSetVerified: async function (userids: any) {
    let ret = await Fynal.post("/admin/set/emailVerified", { userids });
    return ret;
  },
  mySetVerified: async function () {
    let ret = await Fynal.post("/my/set/emailVerified");
    return ret;
  },

  orgJoinCodeNew: async function () {
    let ret = await Fynal.post("/tnt/joincode/new");
    return ret;
  },
  orgJoin: async function (joincode: string) {
    let ret = await Fynal.post("/tnt/join", {
      joincode: joincode,
    });
    return ret;
  },
  orgClearJoinApplications: async function (joincode: string) {
    let ret = await Fynal.post("/tnt/join/clear", {});
    return ret;
  },
  orgSetRegfree: async function (regfree: boolean) {
    let ret = await Fynal.post("/tnt/set/regfree", { regfree: regfree });
    return ret;
  },
  orgMyOrg: async function () {
    let ret = await Fynal.post("/tnt/my/org");
    return ret;
  },
  orgMyOrgSetOrgmode: async function (orgmode: boolean, password: string) {
    let ret = await Fynal.post("/tnt/my/org/set/orgmode", {
      password: password,
      orgmode: orgmode,
    });
    return ret;
  },
  orgApprove: async function (account_eids: string[]) {
    let ret = await Fynal.post("/tnt/approve", { account_eids: account_eids });
    return ret;
  },
  orgSetEmployeeGroup: async function (eids: string[], group: string) {
    let ret = await Fynal.post("/tnt/employee/setgroup", { eids, group });
    return ret;
  },
  orgGetEmployees: async function (payload: Record<string, any>) {
    let ret = await Fynal.post("/tnt/employees", payload);
    return ret;
  },
  myPerm: async function (what: string, op: string, instance_id = undefined) {
    let ret = await Fynal.post("/my/sysperm", { what, instance_id, op });
    return ret;
  },
  employeePerm: async function (
    eid: string,
    what: string,
    op: string,
    instance_id = undefined,
  ) {
    let ret = await Fynal.post("/employee/sysperm", {
      eid,
      what,
      instance_id,
      op,
    });
    return ret;
  },
  // 组织
  getLeaderWithinOrgchart: async function (param: any) {
    let ret = await Fynal.post("orgchart/getleader", param);
    return ret;
  },
  getStaffWithinOrgchart: async function (param: any) {
    let ret = await Fynal.post("orgchart/getstaff", param);
    return ret;
  },
  importFromExcel: async function (param: any) {
    const headers = {
      authorization: Fynal.axiosOptions.headers.authorization,
      ...param.getHeaders(),
    };
    Fynal.axiosOptions.headers = headers;
    let ret = await Fynal.post("orgchart/import/excel", param);
    return ret;
  },
  listOrgchart: async function (param: any) {
    let ret = await Fynal.post("orgchart/list", param);
    return ret;
  },
  listOrgchartOU: async function (param: any) {
    let ret = await Fynal.post("orgchart/listou", param);
    return ret;
  },
};

export default Fynal;
//TODO: simple usage demo: from register, login
