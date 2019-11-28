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
import { external, mergeWith, collect, EOF } from "../../src/index.js";
import { waitTicks } from "../utils.js";

Mocha.describe("mergeWith()", function() {
  Mocha.it("combines 2 observables", async function() {
    const { observable: o1, next: n1 } = external<number>();
    const { observable: o2, next: n2 } = external<number>();

    const list = collect(o1.pipeThrough(mergeWith(o2)));

    const steps = [
      () => n1(0),
      () => n1(1),
      () => n1(2),
      () => n2(3),
      () => n2(4),
      () => n2(5),
      () => n1(6),
      () => n1(7),
      () => n1(EOF),
      () => n2(8),
      () => n2(EOF)
    ];

    for (const step of steps) {
      step();
      await waitTicks();
    }

    chai.expect(await list).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
