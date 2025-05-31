import { startApp } from 'modelence/server';

import typewriterText from './typewriter-text';
import typingSession from './typing-session';

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
  }
});
