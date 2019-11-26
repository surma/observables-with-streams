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
import {
  fromIterable,
  switchAll,
  collect,
  external,
  EOF
} from "../../src/index.js";
import { waitTicks } from "../utils.js";

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
    const superO = external();

    const list = await collect(superO.observable.pipeThrough(switchAll()));

    superO.next(o1);
    await waitTicks();
    o1.next(11), await waitTicks();
    o1.next(12);
    await waitTicks();
    superO.next(o2);
    await waitTicks();
    o2.next(21);
    await waitTicks();
    o1.next(13);
    await waitTicks();
    o1.next(14);
    await waitTicks();
    superO.next(EOF);
    await waitTicks();
    o2.next(22);
    await waitTicks();
    o1.next(EOF);
    await waitTicks();
    o2.next(23);
    await waitTicks();
    o2.next(EOF);
    await waitTicks();

    chai.expect(list).to.deep.equal([11, 12, 21, 22, 23]);
  });
});
