import axios from "axios";
import { AxiosRequestConfig } from "axios";
export default class Client {
  debug: boolean;
  token: string;
  logLevel: number;
  axiosOptions: AxiosRequestConfig<Record<string, any>>;

  constructor() {
    this.token = "";
    this.logLevel = 0;
    this.debug = false;
    this.axiosOptions = {};
  }
  async sleep(miliseconds: number) {
    await new Promise((resolve: any) => setTimeout(resolve, miliseconds));
  }
  setDebug(flag: boolean) {
    this.debug = flag;
  }
  setLogLevel(level: number) {
    this.logLevel = level;
  }
  setHeader(k: string, v: any) {
    this.axiosOptions.headers = this.axiosOptions.headers ?? {};
    this.axiosOptions.headers[k] = v;
  }

  setHttpTimeout(v: number) {
    this.axiosOptions.timeout = v;
  }

  async post(uri: string, payload: Record<string, any> = {}) {
    payload = payload ?? {};
    if (this.debug) console.log("post", uri, payload);
    let ret = await this._post(uri, payload);
    return ret?.data;
  }
  //return full response body.
  async _post(endpoint: string, payload: Record<string, any>) {
    try {
      switch (this.logLevel) {
        case 1:
          console.log("this.post", endpoint);
          break;
        case 2:
        case 3:
          console.log("this.post", endpoint, payload);
      }
      let res = await axios.post(endpoint, payload, this.axiosOptions);
      if (this.logLevel === 3) {
        console.log("response: ", res.data);
      }
      return res;
    } catch (err: any) {
      if (err.response) return err.response;
      else return { data: { error: err.message } };
    }
  }
  async _download(uri: string, payload: Record<string, any>) {
    await axios.post(uri, payload, this.axiosOptions);
  }
  async get(uri: string) {
    let ret = await this._get(uri);
    if (ret && ret.data) return ret.data;
    else {
      console.log(uri);
      console.log(ret);
    }
  }

  async _get(uri: string) {
    try {
      let ret = await axios.get(uri, this.axiosOptions);
      return ret;
    } catch (error: any) {
      return error.response;
    }
  }
  setServer(url: string) {
    this.axiosOptions.baseURL = url;
  }
}
