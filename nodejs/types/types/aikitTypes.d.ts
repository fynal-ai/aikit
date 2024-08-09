interface agentRunOptionType {
    callback: string;
}
export interface agentRunArgType {
    name: string;
    version?: string;
    runId?: string;
    input: Record<string, any>;
    token?: string;
    option: agentRunOptionType;
}
export interface agentResultConsumerIamAliveArgType {
    option: agentRunOptionType;
    token?: string;
}
export interface agentGetResultArgType {
    runId: string;
    deleteAfter: boolean;
    token: string;
}
export {};
