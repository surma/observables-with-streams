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
import { bufferWithCount, collect, range } from "../../src/index.ts";
import { assertEquals } from "../utils.ts";

Deno.test("bufferWithCount()", async function (t) {
  await t.step("splits the stream into chunks", async function () {
    const list = await collect(range(1, 5).pipeThrough(bufferWithCount(2)));

    assertEquals(list, [[1, 2], [3, 4], [5]]);
  });
});
