import * as chai from 'chai';
import 'web-streams-polyfill/es2018';
import { applyPolyfill } from 'message-port-polyfill';

applyPolyfill();

const Mocha = { describe, it };
// @ts-ignore
Object.assign(global, { Mocha, chai });
