import Client from "./client";
import { agentGetResultArgType, agentRunArgType, agentResultConsumerIamAliveArgType } from "./types";
export default class ApmClass extends Client {
    apm_access_id: string;
    apm_access_key: string;
    apm_auth_status: boolean;
    apm_auth_token: string;
    constructor(apm_access_id: string, apm_access_key: string);
    apmAuth(): Promise<any>;
    sleep(milliseconds: number): Promise<void>;
    waitApmAuth(times: number): Promise<void>;
    agentSearch(filter?: {
        hastotal: boolean;
        extrajson: Record<string, any>;
        skip: number;
        limit: number;
        sortBy: Record<string, number>;
        q: string;
    }): Promise<any>;
    agentDetail(payload: {
        name: string;
        version: string;
    }): Promise<any>;
    agentAuth(name: string, arg1: string, arg2: string): Promise<any>;
    agentRun(arg: agentRunArgType): Promise<any>;
    agentResultConsumerIamAlive(arg: agentResultConsumerIamAliveArgType): Promise<void>;
    agentCheckResult(arg: agentGetResultArgType): Promise<any>;
    agentCleanResult(arg: agentGetResultArgType): Promise<any>;
}
