import { agents, defaultConfig } from '@/ai/agents';
import { getFactCheckerPrompt } from '@/ai/prompts';
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

    if (currentAgent?.agentName === 'fact-checker') {
      const factCheckerPrompt = getFactCheckerPrompt(
        messages[messages.length - 1].content
      );
      messages.push({
        role: 'user',
        content: factCheckerPrompt
      });
    }

    const systemPrompt =
      currentAgent?.systemPrompt || defaultConfig.systemPrompt;
    const tools = currentAgent?.tools || {};

    const result = streamText({
      model: google(model, {
        useSearchGrounding: isSearchGrounding,
        ...(currentAgent?.agentName === 'fact-checker' && {
          dynamicRetrievalConfig: {
            mode: 'MODE_DYNAMIC' as const,
            dynamicThreshold: 0
          }
        })
      }),
      system: systemPrompt,
      messages,
      tools,
      temperature: defaultConfig.temperature,
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
      sendReasoning: true,
      sendUsage: true
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
