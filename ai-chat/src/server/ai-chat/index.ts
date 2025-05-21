import { Module } from 'modelence/server';
import { z } from 'zod';

export default new Module('aiChat', {
  mutations: {
    generateResponse: {
      handler: async (args) => {
        const { message } = z.object({
          message: z.string(),
        }).parse(args);

        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
          role: 'assistant',
          content: 'This is a placeholder AI response.',
        };
      },
    },
  },
});

