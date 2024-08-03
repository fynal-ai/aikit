import { AxiosRequestConfig } from "axios";
export default class Client {
    debug: boolean;
    token: string;
    logLevel: number;
    axiosOptions: AxiosRequestConfig<Record<string, any>>;
    constructor();
    sleep(miliseconds: number): Promise<void>;
    setDebug(flag: boolean): void;
    setLogLevel(level: number): void;
    setHeader(k: string, v: any): void;
    setHttpTimeout(v: number): void;
    post(uri: string, payload?: Record<string, any>): Promise<any>;
    _post(endpoint: string, payload: Record<string, any>): Promise<any>;
    _download(uri: string, payload: Record<string, any>): Promise<void>;
    get(uri: string): Promise<any>;
    _get(uri: string): Promise<any>;
    setServer(url: string): void;
}
