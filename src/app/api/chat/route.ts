import { createGoogleGenerativeAI, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 60;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash-preview-04-17'),
    system: 'You are a helpful assistant.',
    messages,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 2048
        }
      } satisfies GoogleGenerativeAIProviderOptions
    }
  });

  console.log(result);
  
  return result.toDataStreamResponse();
}
