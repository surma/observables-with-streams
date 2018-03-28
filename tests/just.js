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
import {just} from '../ows.js';
import {readAll} from './utils.js';

describe('just()', function () {
  it('emits one item and closes the stream', async function () {
    const o = just('ohai');
    expect(await readAll(o)).to.deep.equal(['ohai']);
    expect(async _ => {await o.getReader().closed}).to.not.throw;
  });
});
