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
import { range, collect } from "../../src/index.js";

Mocha.describe("range()", function() {
  Mocha.it("emits a series of integers", async function() {
    const list = await collect(range(-2, 2));
    chai.expect(list).to.deep.equal([-2, -1, 0, 1, 2]);
  });

  Mocha.it("can count backwards", async function() {
    const list = await collect(range(2, -2));
    chai.expect(list).to.deep.equal([2, 1, 0, -1, -2]);
  });
});
