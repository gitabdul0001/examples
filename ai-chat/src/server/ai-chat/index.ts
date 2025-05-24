import { getConfig, Module } from 'modelence/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export default new Module('aiChat', {
  mutations: {
    generateResponse: {
      handler: async (args) => {
        const { message } = z.object({
          message: z.string(),
        }).parse(args);

        const openai = createOpenAI({ apiKey: String(getConfig('_system.openai.apiKey')) });
        const response = await generateText({
          model: openai('gpt-4o'),
          messages: [{
            role: 'user',
            content: message
          }],
        });

        return {
          role: 'assistant',
          content: response.text,
        };
      },
    },
  },
});
