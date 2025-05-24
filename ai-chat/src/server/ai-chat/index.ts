import { getConfig, Module } from 'modelence/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export default new Module('aiChat', {
  mutations: {
    generateResponse: {
      handler: async (args) => {
        const { messages } = z.object({
          messages: z.array(z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string(),
          })),
        }).parse(args);

        const contextMessages = messages.slice(-10);

        const openai = createOpenAI({ apiKey: String(getConfig('_system.openai.apiKey')) });
        const response = await generateText({
          model: openai('gpt-4o'),
          messages: contextMessages,
        });

        return {
          role: 'assistant',
          content: response.text,
        };
      },
    },
  },
});
