import { Module, ObjectId, schema, Store } from 'modelence/server';
import { time } from 'modelence';
import { fetchRandomTextId, typewriterTexts } from '../typewriter-text';
import { z } from 'zod';
import { analyzeSession } from './analyze';

const typingSessions = new Store('typingSessions', {
  schema: {
    textId: schema.ref(typewriterTexts),
    participants: [{
      userId: schema.userId(),
      status: schema.enum(['pending', 'done']),
      speed: schema.number().nullable(),
      endDate: schema.date().optional(),
    }],
    startDate: schema.date().nullable(),
    endDate: schema.date().nullable(),
    status: schema.enum(['pending', 'active', 'over']),
  },
  methods: {
    isActive() {
      return this.status === 'active';
    },
    getParticipant(userId: string) {
      return this.participants.find(participant => participant.userId.toString() === userId);
    },
    async fetchText() {
      return (await typewriterTexts.requireById(this.textId)).text;
    }
  },
  indexes: []
});

function calculateSpeed(text: string, duration: number) {
  const wordCount = text.length / 5;
  const durationInMinutes = duration / time.minutes(1);
  return Math.round(wordCount / durationInMinutes);
}

export default new Module('typingSession', {
  stores: [typingSessions],
  queries: {
    getOwn: {
      permissions: ['typingSession:get:own'],
      async handler(args, { user }) {
        const { id } = z.object({ id: z.string() }).parse(args);
        const typingSession = await typingSessions.requireOne({
          _id: new ObjectId(id),
          'participants.userId': new ObjectId(user.id),
        }, {}, () => new Error('Typing session not found'));
        return {
          session: typingSession,
          text: await typingSession.fetchText(),
        };
      },
    },
    getHistory: {
      permissions: ['typingSession:get:own'],
      async handler(args, { user }) {
        const sessions = await typingSessions
          .fetch({
            'participants.userId': new ObjectId(user.id),
            'participants.status': 'done',
          }, {
            sort: { endDate: -1 },
          });

        return sessions;
      }
    },
  },
  mutations: {
    create: {
      permissions: ['typingSession:create'],
      async handler(args, { user }) {
        // const { textId } = z.object({ textId: z.string() }).parse(args);

        const existingSession = await typingSessions.findOne({
          participants: {
            $elemMatch: {
              userId: user.id,
              status: 'pending'
            }
          },
          status: { $in: ['pending', 'active'] },
        });

        if (existingSession) {
          throw new Error('You already have an active or pending typing session');
        }

        const textId = await fetchRandomTextId();

        const { insertedId } = await typingSessions.insertOne({
          textId,
          participants: [{
            userId: new ObjectId(user.id),
            status: 'pending',
            speed: null,
          }],
          startDate: new Date(),
          endDate: null,
          status: 'active',
        });

        return insertedId;
      },
    },
    complete: {
      permissions: [],
      async handler(args, { user }) {
        const { id } = z.object({ id: z.string() }).parse(args);
        const userId = z.string().parse(user?.id);

        const typingSession = await typingSessions.requireById(id, () => new Error('Typing session not found'));
        if (!typingSession.isActive()) {
          throw new Error('Typing session is not active');
        }
        const participant = typingSession.getParticipant(userId);
        if (!participant) {
          throw new Error(`You don't have access to this typing session`);
        }
        if (participant.status !== 'pending') {
          throw new Error('You have already completed this typing session');
        }
        const startDate = typingSession.startDate;
        if (!startDate) {
          throw new Error('Typing session is missing a start date');
        }
        const text = await typingSession.fetchText();
        const now = new Date();
        const duration = now.getTime() - startDate.getTime();
        const speed = calculateSpeed(text, duration);
        await typingSessions.updateOne({
          _id: new ObjectId(id),
          participants: {
            $elemMatch: {
              userId: new ObjectId(userId),
              status: 'pending'
            }
          },
        }, {
          $set: {
            'participants.$.status': 'done',
            'participants.$.speed': speed,
            'participants.$.endDate': now,
          }
        });

        await typingSessions.updateOne({
          _id: new ObjectId(id),
          participants: { $not: { $elemMatch: { status: { $ne: 'done' } } } }
        }, {
          $set: {
            status: 'over',
            endDate: now,
          }
        });
      },
    },
    analyze: {
      permissions: ['typingSession:analyze'],
      async handler({ text, speed }: { text: string, speed: number }) {
        return analyzeSession(text, speed);
      }
    }
  }
});
