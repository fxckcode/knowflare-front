import { AgentNames } from '@/ai/agents';
import { ToolSet } from 'ai';

export enum Models {
  GPT_4 = 'gpt-4.1',
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini',
  GEMINI_2_5_FLASH_PREVIEW_04_17 = 'gemini-2.0-flash-exp',
  GEMINI_2_5_PRO_PREVIEW_03_25 = 'gemini-2.0-flash-exp',
  GEMINI_2_0_FLASH_EXP = 'gemini-2.0-flash-exp'
}

export type Agent = {
  name: string;
  description: string;
  image: string;
  agentName: AgentNames;
  systemPrompt: string;
  tools?: ToolSet;
  suggestions?: {
    suggestion: string;
    prompt: string;
  }[];
  userSearch?: boolean;
};

export type Model = {
  name: string;
  provider: string;
  description: string;
  value: string;
};
