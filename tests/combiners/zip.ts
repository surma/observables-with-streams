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

import { fromIterable, zip, collect } from "../../src/index.js";

Mocha.describe("zip()", function() {
  Mocha.it("zips multiple observables", async function() {
    const list = await collect(
      zip<string | number>(
        fromIterable([1, 2, 3, 4]),
        fromIterable(["one", "two", "three", "four"]),
        fromIterable(["eins", "zwei", "drei"])
      )
    );

    chai.expect(list).to.deep.equal([
      [1, "one", "eins"],
      [2, "two", "zwei"],
      [3, "three", "drei"]
    ]);
  });
});
