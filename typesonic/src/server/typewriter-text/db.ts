import { schema, Store } from 'modelence/server';

export const dbTexts = new Store('typewriterTexts', {
  schema: {
    text: schema.string(),
    addedDate: schema.date(),
  },
  indexes: [
    { key: { addedDate: -1 } }
  ]
});
