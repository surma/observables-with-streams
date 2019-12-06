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

import { external, EOF, concat, collect, range } from "../../src/index.js";
import { waitTicks } from "../utils.js";

Mocha.describe("concat()", function() {
  Mocha.it("concatenates multiple observables", async function() {
    const { observable, next } = external();
    const list = collect(concat(range(1, 3), observable, range(5, 7)));

    (async () => {
      await waitTicks();
      next(4);
      await waitTicks();
      next(EOF);
    })();

    chai.expect(await list).to.deep.equal([1, 2, 3, 4, 5, 6, 7]);
  });
});
