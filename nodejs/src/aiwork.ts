import axios from "axios";
import Client from "./client";

export default class AiWorkClass extends Client {
  constructor() {
    process.env.EMP_SERVER ??
      (console.log("EMP_SERVER is not set"), process.exit(1));
    super();
    this.axiosOptions.baseURL = process.env.EMP_SERVER;
  }

  hello() {
    return "Hello, this is AiWork, the AI agent that collaborates with other agents and people";
  }

  async getWorklist(doer: string, arg1?: any, arg2?: any) {
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
      res = await this.post("/work/search", {
        doer: doer,
        ...filter,
      });
      if (!res) {
        throw new Error("EMP server response is nullish");
      }
      if (res.total > 0) break;
      else if (repeatTimesUntilGotOne > 1) {
        await this.sleep(1000);
      }
    }
    return res;
  }

  async createTemplate(tplid: string, desc = "") {
    let ret = await this.post("/template/create", { tplid: tplid, desc });
    return ret;
  }

  async putTemplate(tpl_data: string, tplid: string, desc = "") {
    if (!tplid) throw new Error("Tplid must be provided");
    let ret = await this.post("/template/put", {
      doc: tpl_data,
      tplid,
      forceupdate: true,
      desc,
    });
    return ret;
  }

  async importTemplateXML(tplid: string, fileObj: any) {
    var formData = new FormData();
    formData.append("tplid", tplid);
    formData.append("file", fileObj, fileObj.name);
    let option = this.axiosOptions;
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
  }

  async readTemplate(tpl_id: string) {
    let ret = await this.post("/template/read", {
      tplid: tpl_id,
    });
    return ret;
  }
  async readWorkflow(wfid: string) {
    let ret = await this.post("/workflow/read", {
      wfid: wfid,
    });
    return ret;
  }
  async exportTemplate(tpl_id: string) {
    let tmpOption = this.axiosOptions;
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
        return response.data;
        // How to download the tempalte automatically in browser
        // const url = window.URL.createObjectURL(new Blob([response.data]));
        // $(".tempLink").remove();
        // const link = document.createElement("a");
        // link.href = url;
        // link.setAttribute("download", `${tpl_id}.xml`);
        // link.setAttribute("class", "tempLink");
        // document.body.appendChild(link);
        // //点击这个临时连接实现内容下载
        // link.click();
      });
  }

  async listTemplate() {
    let ret = await this.get("/template/list");
    return ret;
  }

  //Rename with internal _id
  async renameTemplateWithIid(_id: string, tplid: string) {
    let ret = await this.post("/template/renamewithiid", {
      _id: _id,
      tplid: tplid,
    });
    return ret;
  }

  async renameTemplate(fromid: string, tplid: string) {
    let ret = await this.post("/template/rename", {
      fromid: fromid,
      tplid: tplid,
    });
    return ret;
  }

  async deleteTemplate(_id: string) {
    let ret = await this.post("/template/delete", {
      _id: _id,
    });
    return ret;
  }

  async deleteTemplateByTplid(tplid: string) {
    let ret = await this.post("/template/delete/by/tplid", {
      tplid: tplid,
    });
    return ret;
  }

  async makeCopyOfTemplate(_id: string) {
    let ret = await this.post("/template/makecopy", {
      _id: _id,
    });
    return ret;
  }

  async copyTemplateTo(fromid: string, tplid: string) {
    let ret = await this.post("/template/copyto", {
      fromid: fromid,
      tplid: tplid,
    });
    return ret;
  }
  async getPbo(wfid: string, pbotype = "text") {
    let ret = await this.post("/workflow/get/pbo", {
      wfid: wfid,
      pbotype: pbotype,
    });
    return ret;
  }
  async setPbo(wfid: string, pbo: string, pbotype: string, stepid: string) {
    let ret = await this.post("/workflow/set/pbo", {
      wfid: wfid,
      pbo: pbo,
      pbotype: pbotype,
      stepid: stepid,
    });
    return ret;
  }

  async startWorkflow(
    tplid: string,
    wfid: string = "",
    teamid = "",
    pbo = "",
    kvars = {},
  ) {
    let ret = await this.post("/workflow/start", {
      tplid: tplid,
      wfid: wfid,
      teamid: teamid,
      textPbo: pbo,
      kvars: kvars,
    });
    return ret;
  }

  async opWorkflow(wfid: string, op: string) {
    return await this.post("/workflow/op", { wfid, op });
  }

  async pauseWorkflow(wfid: string) {
    let ret = await this.post("/workflow/pause", {
      wfid: wfid,
    });
    return ret;
  }

  async resumeWorkflow(wfid: string) {
    let ret = await this.post("/workflow/resume", {
      wfid: wfid,
    });
    return ret;
  }
  async stopWorkflow(wfid: string) {
    let ret = await this.post("/workflow/stop", {
      wfid: wfid,
    });
    return ret;
  }

  async workflowSearch(filter: Record<string, any>) {
    let ret = await this.post("/workflow/search", filter);
    return ret;
  }

  async workflowGetLatest(filter: Record<string, any>) {
    let ret = await this.post("/workflow/latest", {
      filter: filter,
    });
    return ret;
  }

  async destroyWorkflow(wfid: string) {
    let ret = await this.post("/workflow/destroy", { wfid: wfid });
    return ret;
  }
  async destroyMultiWorkflows(wfids: string[]) {
    let ret = await this.post("/workflow/destroy/multi", { wfids });
    return ret;
  }
  async destroyWorkflowByWfTitle(wftitle: string) {
    let ret = await this.post("/workflow/destroy/by/title", { wftitle });
    return ret;
  }
  async destroyWorkflowByTplid(tplid: string) {
    let ret = await this.post("/workflow/destroy/by/tplid", { tplid });
    return ret;
  }

  async doWork(doer: string, todoid: string, kvars = {}, route = "DEFAULT") {
    let ret = await this.post("/work/do", {
      doer: doer,
      todoid: todoid,
      route: route,
      kvars: kvars,
    });
    return ret;
  }
  //根据wfid， 和nodeid，执行wfid里的一个nodeid的todo
  async doWorkByNode(
    doer: string,
    wfid: string,
    nodeid: string,
    kvars = {},
    route = "DEFAULT",
  ) {
    let ret = await this.post("/work/do/bynode", {
      doer: doer,
      wfid: wfid,
      nodeid: nodeid,
      route: route,
      kvars: kvars,
    });
    return ret;
  }

  async getKVars(wfid: string, workid: string) {
    let ret = await this.post(
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
  }

  async getStatus(wfid: string, todoid: string | undefined = undefined) {
    let ret = "ST_UNKNOWN";
    if (todoid)
      ret = await this.post("/work/status", {
        wfid: wfid,
        todoid: todoid,
      });
    else
      ret = await this.post("/workflow/status", {
        wfid: wfid,
      });

    return ret;
  }

  async revoke(wfid: string, todoid: string, comment: string = "") {
    let ret = await this.post("/work/revoke", {
      wfid: wfid,
      todoid: todoid,
      comment: comment,
    });
    return ret;
  }

  async sendback(doer: string, wfid: string, todoid: string, kvars = {}) {
    let ret = await this.post("/work/sendback", {
      doer: doer,
      wfid: wfid,
      todoid: todoid,
      kvars,
    });
    return ret;
  }

  async getWorkInfo(todoid: string) {
    let ret = await this.post("/work/info", {
      todoid: todoid,
    });

    return ret;
  }

  async uploadTeam(name: string, tmap: string) {
    let payload = { teamid: name, tmap: tmap };
    let ret = await this.post("/team/upload", payload);
    return ret;
  }

  async setRole(teamid: string, role: string, members: string[]) {
    let payload = { teamid: teamid, role: role, members: members };
    let ret = await this.post("/team/role/set", payload);
    return ret;
  }

  async addRoleMembers(teamid: string, role: string, members: string[]) {
    let payload = { teamid: teamid, role: role, members: members };
    let ret = await this.post("/team/role/member/add", payload);
    return ret;
  }

  async deleteRoleMembers(teamid: string, role: string, members: string[]) {
    let payload = { teamid: teamid, role: role, eids: members };
    let ret = await this.post("/team/role/member/delete", payload);
    return ret;
  }

  async copyRole(teamid: string, role: string, newrole: string) {
    let payload = { teamid: teamid, role: role, newrole: newrole };
    let ret = await this.post("/team/role/copy", payload);
    return ret;
  }

  async importTeamCSV(teamid: string, fileObj: any) {
    var formData = new FormData();
    formData.append("teamid", teamid);
    formData.append("file", fileObj, fileObj.name);
    let option = this.axiosOptions;
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
  }

  async getTeamFullInfo(teamid: string) {
    let ret = await this.get(`/team/fullinfo/${teamid}`);
    return ret;
  }

  async getTeamList(payload: Record<string, any>) {
    payload = payload ? payload : { limit: 1000 };
    return await this.post("/team/search", payload);
  }

  async getCallbackPoints(cbpFilter: Record<string, any>) {
    let ret = await this.post("/workflow/cbps", cbpFilter);
    return ret;
  }

  async getLatestCallbackPoint(cbpFilter: Record<string, any>) {
    let ret = await this.post("/workflow/cbps/latest", cbpFilter);
    return ret;
  }

  async doCallback(cbpid: string, decision: string, kvars: any, atts: any) {
    let payload: any = { cbpid, decision };
    if (kvars) {
      payload.kvars = kvars;
      if (atts) {
        payload.atts = atts;
      }
    }
    let ret = await this.post("/workflow/docallback", payload);
    return ret;
  }

  async deleteTeam(name: string) {
    let payload = { teamid: name };
    let ret = await this.post("/team/delete", payload);
    return ret;
  }

  __checkError(ret: any) {
    if (ret.errors) {
      throw new Error(ret.errors);
    }
  }

  async register(account: string, username: string, password: string) {
    this.setHeader("Content-type", "application/json");
    let endpoint = "/account/register";
    let payload = {
      account: account,
      username: username,
      password: password,
    };
    let response = await this.post(endpoint, payload);
    if (response?.sessionToken) {
      this.setHeader("authorization", response.sessionToken);
    }
    return response;
  }
  async verify(token: string) {
    let response = await this.post("/account/verifyEmail", { token });
    return response;
  }
  async removeUser(account: string, site_passwd: string) {
    let ret = await this.post("/admin/remove/account", {
      account: account,
      password: site_passwd,
    });

    return ret;
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
      this.setHeader("authorization", response.sessionToken);
    }
    return response;
  }

  async setUserName(username: string) {
    this.setHeader("Content-type", "application/json");
    let response = await this.post("/account/set/username", {
      username,
    });
    return response;
  }

  async setUserPassword(oldpassword: string, password: string) {
    this.setHeader("Content-type", "application/json");
    let response = await this.post("/account/set/password", {
      oldpassword,
      password,
    });
    return response;
  }

  getSessionToken() {
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
  }
  setSessionToken(token: string) {
    if (token) {
      //console.log("this.authorization token", token);
      this.setHeader("authorization", `Bearer ${token}`);
    } else {
      if (localStorage) {
        let token = localStorage.getItem("sessionToken");
        if (token) {
          this.setHeader("authorization", `Bearer ${token}`);
          //console.log("this.authorization token", token);
        }
      }
    }
  }

  async profile() {
    let response = await this.get("/account/profile/me");
    return response;
  }

  async logout(token: string) {
    if (token) {
      this.setHeader("authorization", token);
    }
    let response = await this.post("/account/logout", {});
    return response;
  }

  async adminSetVerified(userids: any) {
    let ret = await this.post("/admin/set/emailVerified", { userids });
    return ret;
  }
  async mySetVerified() {
    let ret = await this.post("/my/set/emailVerified");
    return ret;
  }

  async orgJoinCodeNew() {
    let ret = await this.post("/tnt/joincode/new");
    return ret;
  }
  async orgJoin(joincode: string) {
    let ret = await this.post("/tnt/join", {
      joincode: joincode,
    });
    return ret;
  }
  async orgClearJoinApplications() {
    let ret = await this.post("/tnt/join/clear", {});
    return ret;
  }
  async orgSetRegfree(regfree: boolean) {
    let ret = await this.post("/tnt/set/regfree", { regfree: regfree });
    return ret;
  }
  async orgMyOrg() {
    let ret = await this.post("/tnt/my/org");
    return ret;
  }
  async orgMyOrgSetOrgmode(orgmode: boolean, password: string) {
    let ret = await this.post("/tnt/my/org/set/orgmode", {
      password: password,
      orgmode: orgmode,
    });
    return ret;
  }
  async orgApprove(account_eids: string[]) {
    let ret = await this.post("/tnt/approve", { account_eids: account_eids });
    return ret;
  }
  async orgSetEmployeeGroup(eids: string[], group: string) {
    let ret = await this.post("/tnt/employee/setgroup", { eids, group });
    return ret;
  }
  async orgGetEmployees(payload: Record<string, any>) {
    let ret = await this.post("/tnt/employees", payload);
    return ret;
  }
  async myPerm(what: string, op: string, instance_id = undefined) {
    let ret = await this.post("/my/sysperm", { what, instance_id, op });
    return ret;
  }
  async employeePerm(
    eid: string,
    what: string,
    op: string,
    instance_id = undefined,
  ) {
    let ret = await this.post("/employee/sysperm", {
      eid,
      what,
      instance_id,
      op,
    });
    return ret;
  }
  // 组织
  async getLeaderWithinOrgchart(param: any) {
    let ret = await this.post("orgchart/getleader", param);
    return ret;
  }
  async getStaffWithinOrgchart(param: any) {
    let ret = await this.post("orgchart/getstaff", param);
    return ret;
  }
  async importFromExcel(param: any) {
    this.axiosOptions.headers = this.axiosOptions.headers ?? {};
    const headers = {
      authorization: this.axiosOptions.headers.authorization,
      ...param.getHeaders(),
    };
    this.axiosOptions.headers = headers;
    let ret = await this.post("orgchart/import/excel", param);
    return ret;
  }
  async listOrgchart(param: any) {
    let ret = await this.post("orgchart/list", param);
    return ret;
  }
  async listOrgchartOU(param: any) {
    let ret = await this.post("orgchart/listou", param);
    return ret;
  }
}
