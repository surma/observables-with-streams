/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {from, delay} from '../ows.js';

describe('delay()', function () {
  it('delays items but a fixed amount of time', async function () {
    const {port1, port2} = new MessageChannel();
    const o = from(port2, 'message').pipeThrough(delay(100));
    port2.start();
    const r = o.getReader();

    let timestamp = performance.now();
    port1.postMessage('ohai');
    await r.read();
    const delta = performance.now() - timestamp;
    expect(delta - 100).to.be.lessThan(10);
  });
});
