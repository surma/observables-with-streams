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
import { range, fromIterable, last } from "../../src/index.js";

Mocha.describe("last()", function() {
  Mocha.it("returns the last item", async function() {
    const item = await last(range(1, 9));
    chai.expect(item).to.equal(9);
  });

  Mocha.it("throws if no items are emitted", function(done) {
    last(fromIterable([]))
      .then(() => done("last() did not throw"))
      .catch(() => done());
  });
});
