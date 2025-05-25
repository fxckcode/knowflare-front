import { generateImage } from '@/app/actions/generate-image';
import { tool } from 'ai';
import { z } from 'zod';

const generateImageTool = tool({
  description: 'Use this tool to generate an image',
  parameters: z.object({
    prompt: z.string()
  }),
  execute: async ({ prompt }: { prompt: string }) => {
    console.log('Executing generateImageTool', prompt);
    const image = await generateImage(prompt);
    return image;
  }
});

export { generateImageTool };
