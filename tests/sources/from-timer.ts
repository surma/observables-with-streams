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
import { fromTimer } from "../../src/index.ts";
import { assert } from "../utils.ts";

Deno.test("fromTimer()", async function (t) {
  await t.step("emits null in the given interval", async function () {
    const observable = fromTimer(10);

    const start = Date.now();
    const reader = observable.getReader();
    for (let i = 0; i < 4; i++) {
      await reader.read();
    }
    const end = Date.now();
    assert(end - start >= 40);

    await reader.cancel();
  });
});
