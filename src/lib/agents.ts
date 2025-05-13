import {
  aiPromptGeneratorSystemPrompt,
  socratesSystemPrompt,
  yodaSystemPrompt
} from '@/ai/prompts';
import { Agent, Model, Models } from './types';
import { z } from 'zod';

export const models: Model[] = [
  // {
  //   name: 'GPT-4.1',
  //   provider: 'OpenAI',
  //   description:
  //     'OpenAI’s most powerful model. Excellent at coding, writing, and complex tasks.',
  //   value: Models.GPT_4
  // },
  // {
  //   name: 'GPT-4o',
  //   provider: 'OpenAI',
  //   description:
  //     'OpenAI’s most powerful model. Excellent at coding, writing, and complex tasks.',
  //   value: Models.GPT_4O
  // },
  {
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    description: 'Advanced reasoning, coding, and multimodal understanding.',
    value: Models.GEMINI_2_5_PRO_PREVIEW_03_25
  },
  {
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    description: 'Advanced reasoning, coding, and multimodal understanding.',
    value: Models.GEMINI_2_5_FLASH_PREVIEW_04_17
  }
];

export const agents: Agent[] = [
  {
    name: 'AI Prompt Generator',
    description: 'A helpful assistant that can help you with your tasks.',
    image: '/images/agents/ai-prompt-generator.png',
    agentName: 'ai-prompt-generator',
    systemPrompt: aiPromptGeneratorSystemPrompt,
    tools: {
      showPromptInCanvas: {
        description: 'This tool is used to show a prompt generator.',
        parameters: z.object({
          prompt: z
            .string()
            .describe(
              'The prompt to generate a prompt from your current context.'
            )
        }),
        execute: async ({ prompt }) => {
          console.log('prompt', prompt);
          return { prompt };
        }
      }
    }
  },
  {
    name: 'Yoda',
    description:
      'Yoda is a helpful assistant that can help you with your tasks.',
    image:
      'https://s1.elespanol.com/2015/12/11/actualidad/actualidad_86001588_298582_1706x1280.jpg',
    agentName: 'yoda',
    systemPrompt: yodaSystemPrompt
  },
  {
    name: 'Socrates',
    description:
      'Socrates is a helpful assistant that can help you with your tasks.',
    image:
      'https://dialektika.org/wp-content/uploads/2023/05/Socrates.jpg.webp',
    agentName: 'socrates',
    systemPrompt: socratesSystemPrompt
  }
  // {
  //   name: 'N8N Agent',
  //   description:
  //     'N8N Agent is a helpful assistant that can help you with your tasks.',
  //   image: '/images/agents/n8n-agent.png',
  //   agentName: 'n8n-agent',
  //   systemPrompt: ''
  // }
];
