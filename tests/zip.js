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
import {repeat, zip, take} from '../ows.js';
import {readAll} from './utils.js';

describe('zip()', function () {
  it('zips multiple observables', async function () {
    const o = zip(repeat('o1'), repeat('o2')).pipeThrough(take(4));
    expect(await readAll(o)).to.deep.equal([['o1', 'o2'], ['o1', 'o2'], ['o1', 'o2'], ['o1', 'o2']]);
  });
});
