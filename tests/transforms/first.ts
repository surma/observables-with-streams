/**
 * Copyright 2019 Google Inc. All Rights Reserved.
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
import { range, first, collect } from "../../src/index.js";

Mocha.describe("first()", function() {
  Mocha.it("returns the first item", async function() {
    const list = await collect(range(1, 4).pipeThrough(first()));

    chai.expect(list).to.deep.equal([1]);
  });
});
