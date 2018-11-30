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
import { fromIterable, single } from "../ows.js";

Mocha.describe("single()", function() {
  Mocha.it(
    "returns the the item when there is exactly one item",
    async function() {
      const item = await single(fromIterable([1]));
      chai.expect(item).to.equal(1);
    }
  );

  Mocha.it("throws if no items are emitted", function(done) {
    single(fromIterable([]))
      .then(() => done("single() did not throw"))
      .catch(() => done());
  });

  Mocha.it("throws if more than one item is emitted", function(done) {
    single(fromIterable([1, 2]))
      .then(() => done("single() did not throw"))
      .catch(() => done());
  });
});
