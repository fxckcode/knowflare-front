import { agents } from '@/lib/agents';
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderOptions
} from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY
});

export async function POST(req: Request) {
  const { messages, model, agentName } = await req.json();
  const currentAgent = agents.find(agent => agent.agentName === agentName);

  const result = streamText({
    model: google(model),
    system:
      currentAgent?.systemPrompt ||
      'You are a helpful assistant. Your name is Idle.',
    messages,
    tools: currentAgent?.tools || {},
    temperature: 0.7,
    maxRetries: 1,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 2048
        }
      } satisfies GoogleGenerativeAIProviderOptions
    }
  });

  return result.toDataStreamResponse();
}
