export interface AgentDefinition {
  _id: string;
  author: string;
  version: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  doc: string;
  config: {
    params: Record<string, any>;
    return: Record<string, any>;
  };
}
