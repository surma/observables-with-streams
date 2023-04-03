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
import { collect, fromIterable, zipWith } from "../../src/index.ts";
import { assertEquals } from "../utils.ts";

Deno.test("zipWith()", async function (t) {
  await t.step("combines 2 observables", async function () {
    const list = await collect(
      fromIterable([1, 2, 3]).pipeThrough(
        zipWith(fromIterable(["a", "b", "c", "d"])),
      ),
    );

    assertEquals(list, [
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ]);
  });
});
