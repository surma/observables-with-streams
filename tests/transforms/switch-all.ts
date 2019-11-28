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
import {
  fromIterable,
  switchAll,
  collect,
  external,
  EOF
} from "../../src/index.js";
import { NextFunc } from "../../src/sources/external.js";

import { waitTicks } from "../utils.js";

function safeNext<T>(o: { next: NextFunc<T> }, v: T) {
  try {
    o.next(v);
  } catch (e) {}
}

Mocha.describe("switch-all()", function() {
  Mocha.it("re-emit the first observable", async function() {
    const list = await collect(
      fromIterable([fromIterable([1, 2, 3])]).pipeThrough(switchAll())
    );

    chai.expect(list).to.deep.equal([1, 2, 3]);
  });

  Mocha.it("switches to the most recent active observable", async function() {
    const o1 = external();
    const o2 = external();
    const outerO = external();

    const listP = collect(outerO.observable.pipeThrough(switchAll()));

    outerO.next(o1.observable);
    await waitTicks();
    safeNext(o1, 11);
    await waitTicks();
    safeNext(o1, 12);
    await waitTicks();
    outerO.next(o2.observable);
    await waitTicks();
    safeNext(o2, 21);
    await waitTicks();
    safeNext(o1, 13);
    await waitTicks();
    safeNext(o1, 14);
    await waitTicks();
    outerO.next(EOF);
    await waitTicks();
    safeNext(o2, 22);
    await waitTicks();
    safeNext(o1, EOF);
    await waitTicks();
    safeNext(o2, 23);
    await waitTicks();
    safeNext(o2, EOF);
    await waitTicks();

    chai.expect(await listP).to.deep.equal([11, 12, 21, 22, 23]);
  });

  Mocha.it("handles closing streams correctly", async function() {
    const o1 = external();
    const o2 = external();
    const outerO = external();

    const listP = collect(outerO.observable.pipeThrough(switchAll()));

    outerO.next(o1.observable);
    await waitTicks();
    safeNext(o1, 11);
    await waitTicks();
    safeNext(o1, EOF);
    await waitTicks();
    outerO.next(o2.observable);
    outerO.next(EOF);
    await waitTicks();
    safeNext(o2, 21);
    await waitTicks();
    safeNext(o2, 22);
    await waitTicks();
    safeNext(o2, EOF);
    await waitTicks();

    chai.expect(await listP).to.deep.equal([11, 21, 22]);
  });
});
