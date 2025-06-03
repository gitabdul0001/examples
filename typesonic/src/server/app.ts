import { startApp } from 'modelence/server';

import typewriterText from './typewriter-text';
import typingSession from './typing-session';
import { initializeTexts } from './initialData';

startApp({
  modules: [typewriterText, typingSession],
  roles: {
    guest: {
      permissions: [],
    },
    user: {
      permissions: ['typingSession:create', 'typingSession:get:own', 'typingSession:analyze']
    },
  },
  defaultRoles: {
    unauthenticated: 'guest',
    authenticated: 'user',
  },
  migrations: [{
    version: 1,
    description: 'Initialize texts',
    handler: initializeTexts,
  }]
});
