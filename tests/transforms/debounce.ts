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
import { external, debounce, collect, EOF } from "../../src/index.js";
import { forEach } from "../../src/index.js";
import { waitTicks } from "../utils.js";

function wait() {
  return new Promise(resolve => setTimeout(resolve, 100));
}
Mocha.describe("debounce()", function() {
  Mocha.it("debounces an observable", async function() {
    const { observable, next } = external<number>();

    const list = collect(observable.pipeThrough(debounce(5)));

    const steps = [
      () => next(0),
      () => wait(),
      () => next(1),
      () => next(1),
      () => wait(),
      () => wait(),
      () => wait(),
      () => next(2),
      () => next(3),
      () => next(4),
      () => wait(),
      () => wait(),
      () => wait(),
      () => next(5),
      () => next(6),
      () => next(EOF)
    ];

    for (const step of steps) {
      await step();
    }

    chai.expect(await list).to.deep.equal([0, 1, 1, 2, 4, 5]);
  });
});
