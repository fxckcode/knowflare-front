import { agents } from '@/lib/agents';
import { Agent } from '@/lib/types';
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
  try {
    const { messages, model, agentName, isSearchGrounding } = await req.json();
    const currentAgent = agents.find(agent => agent.agentName === agentName);

    const { systemPrompt, tools } = currentAgent as Agent;
    console.log('isSearchGrounding', isSearchGrounding);
    const result = streamText({
      model: google(model, {
        useSearchGrounding: isSearchGrounding
      }),
      system: systemPrompt || 'You are a helpful assistant. Your name is Idle.',
      messages,
      tools: tools || {},
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

    return result.toDataStreamResponse({
      sendSources: true,
      sendReasoning: true
    });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
