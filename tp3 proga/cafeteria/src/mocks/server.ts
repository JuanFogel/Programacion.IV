import { setupServer } from 'msw/node';import { setupServer } from 'msw/node';

import { handlers } from './handlers';import { handlers } from './handlers';



export const server = setupServer(...handlers);export const server = setupServer(...handlers);


