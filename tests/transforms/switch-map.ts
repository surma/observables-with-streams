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
import { collect, just, range, switchMap } from "../../src/index.ts";
import { assertEquals } from "../utils.ts";

Deno.test("switch-all()", async function (t) {
  await t.step("re-emit the first observable", async function () {
    const list = await collect(
      just(5).pipeThrough(switchMap((v) => range(1, v))),
    );

    assertEquals(list, [1, 2, 3, 4, 5]);
  });
});
