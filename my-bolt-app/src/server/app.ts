import { startApp } from 'modelence/server';
import postsModule from './posts';

startApp({
    modules: [postsModule]
});
