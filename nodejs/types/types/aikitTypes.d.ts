export interface agentRunArgType {
    name: string;
    version?: string;
    runId?: string;
    input: Record<string, any>;
    token?: string;
}
export interface agentGetResultArgType {
    runId: string;
    deleteAfter: boolean;
    token: string;
}
