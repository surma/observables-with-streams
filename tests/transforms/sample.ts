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
import { collect, EOF, external, sample } from "../../src/index.ts";

import { assertEquals, waitTicks } from "../utils.ts";

Deno.test("sample()", async function (t) {
  await t.step("emits samples", async function () {
    const notifier = external();
    const { observable, next } = external();

    const listP = collect(observable.pipeThrough(sample(notifier.observable)));

    notifier.next(null);
    await waitTicks();
    next(1);
    await waitTicks();
    next(2);
    await waitTicks();
    notifier.next(null);
    await waitTicks();
    next(3);
    await waitTicks();
    notifier.next(null);
    await waitTicks();
    next(4);
    await waitTicks();
    notifier.next(EOF);
    await waitTicks();
    next(5);
    await waitTicks();
    next(EOF);
    await waitTicks();

    assertEquals(await listP, [2, 3]);
  });
});
