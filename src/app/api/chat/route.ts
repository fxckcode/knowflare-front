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
  const { messages, model, agent } = await req.json();
  const result = streamText({
    model: google(model),
    system: agent,
    messages,
    temperature: 0.7,
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
