import { generateImage } from '@/app/actions/generate-image';
import { tool } from 'ai';
import { z } from 'zod';

const showPromptInCanvas = tool({
  description: 'Use this tool to show a prompt in the canvas',
  parameters: z.object({
    prompt: z.string().describe('The prompt to show in the canvas')
  }),
  execute: async ({ prompt }: { prompt: string }) => {
    return {
      prompt
    }
  }
});

const generateReportTool = tool({
  description: 'Genera un informe detallado basado en la consulta del usuario. Útil para resúmenes, análisis o compilaciones de datos.',
  parameters: z.object({
    query: z.string().describe('La consulta o tema para el informe.'),
  }),
  execute: async ({ query }: { query: string }) => {
    // This is a dummy tool, so we just return a success message.
    // The actual UI is handled on the frontend.
    return { success: true, query };
  },
});

const visualizeDataTool = tool({
  description: 'Genera una visualización de datos basada en la consulta del usuario. Útil para crear gráficos, tablas o dashboards.',
  parameters: z.object({
    query: z.string().describe('La consulta o los datos para visualizar.'),
  }),
  execute: async ({ query }: { query: string }) => {
    // This is a dummy tool, so we just return a success message.
    // The actual UI is handled on the frontend.
    return { success: true, query };
  },
});

// TODO: Implement this tool to generate an image
const generateImageTool = tool({
  description: 'Use this tool to generate an image',
  parameters: z.object({
    prompt: z.string()
  }),
  execute: async ({ prompt }: { prompt: string }) => {
    const image = await generateImage(prompt);
    return image;
  }
});


export { generateImageTool, generateReportTool, showPromptInCanvas, visualizeDataTool };
