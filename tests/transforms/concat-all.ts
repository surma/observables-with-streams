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
import { collect, concatAll, fromIterable, just } from "../../src/index.ts";
import { assertEquals } from "../utils.ts";

Deno.test("concatAll()", async function (t) {
  await t.step("concatenates emitted observables", async function () {
    const list = await collect(
      fromIterable([
        fromIterable([1, 2, 3]),
        just(4),
        fromIterable([5, 6]),
      ]).pipeThrough(concatAll()),
    );

    assertEquals(list, [1, 2, 3, 4, 5, 6]);
  });
});
