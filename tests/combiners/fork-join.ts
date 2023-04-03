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

import { forkJoin, range, single } from "../../src/index.ts";
import { assertEquals } from "../utils.ts";

Deno.test("forkJoin()", async function (t) {
  await t.step("merges multiple observables", async function () {
    const o1 = range(1, 9);
    const o2 = range(11, 13);
    const o3 = range(21, 21);
    const list = await single(forkJoin(o1, o2, o3));

    assertEquals(list, [9, 13, 21]);
  });
});
