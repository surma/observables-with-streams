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
import { collect, debounce, EOF, external } from "../../src/index.ts";
import { assertEquals, waitMs } from "../utils.ts";

Deno.test("debounce()", async function (t) {
  await t.step("debounces an observable", async function () {
    const { observable, next } = external<number>();

    const list = collect(observable.pipeThrough(debounce(9)));

    next(0);
    await waitMs(5);
    next(1);
    await waitMs(10);
    next(2);
    await waitMs(1);
    next(3);
    await waitMs(1);
    next(4);
    await waitMs(1);
    next(5);
    await waitMs(10);
    next(6);
    next(EOF);

    assertEquals(await list, [1, 5, 6]);
  });
});
