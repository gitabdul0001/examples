import { Module } from 'modelence/server';
import { ConfigSchema, time } from 'modelence';
import { dbTexts } from './db';

export async function fetchRandomTextId() {
  const typewriterTextDoc = await dbTexts.aggregate([
    { $sample: { size: 1 } }
  ]).next();

  if (!typewriterTextDoc) {
    throw new Error('No typewriter text found');
  }

  return typewriterTextDoc._id;
}

const queries = {
  async getOne() {
    const typewriterTextDoc = await dbTexts.aggregate([
      { $sample: { size: 1 } }
    ]).next();
    return typewriterTextDoc?.text || '';
  }
};

/*
const queries = {
  getOne: {
    rateLimit: {
      max: 10,
      window: time.seconds(1),
    },
    permissions: [...],
    async handler() {
      ...
    }
  }
};
*/

const cronJobs = {
  heartbeat: {
    description: 'Heartbeat cron job',
    interval: time.seconds(10),
    handler: async () => {
      // console.log('heartbeat cron job');
    }
  }
};

const configSchema: ConfigSchema = {
  'format.maxLineLength': {
    type: 'number',
    default: 40,
    isPublic: true,
  },
};

export default new Module('typewriterText', {
  stores: [dbTexts],
  queries,
  cronJobs,
  configSchema
});
