import { create } from 'zustand';
import { Agent } from '@/lib/types';

interface AgentStore {
  agent: Agent | null;
  setAgent: (agent: Agent) => void;
}

export const useAgent = create<AgentStore>(set => ({
  agent: null,
  setAgent: agent => set({ agent })
}));
