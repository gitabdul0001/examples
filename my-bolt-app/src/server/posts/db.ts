import { Store, schema } from 'modelence/server';

export const dbPosts = new Store('posts', {
  schema: {
    userId: schema.userId(),
    content: schema.string(),
    platform: schema.enum(['twitter', 'linkedin', 'facebook', 'instagram']),
    tone: schema.enum(['professional', 'casual', 'funny', 'inspirational', 'promotional']),
    hashtags: [schema.string()],
    prompt: schema.string(),
    createdAt: schema.date(),
    updatedAt: schema.date(),
    isPublished: schema.boolean(),
  },
  indexes: [
    { key: { userId: 1, createdAt: -1 } },
    { key: { platform: 1 } },
  ],
});

export const dbTemplates = new Store('templates', {
  schema: {
    userId: schema.userId().optional(),
    name: schema.string(),
    prompt: schema.string(),
    platform: schema.enum(['twitter', 'linkedin', 'facebook', 'instagram', 'all']),
    tone: schema.enum(['professional', 'casual', 'funny', 'inspirational', 'promotional']),
    isPublic: schema.boolean(),
    createdAt: schema.date(),
  },
  indexes: [
    { key: { isPublic: 1, platform: 1 } },
    { key: { userId: 1 } },
  ],
});