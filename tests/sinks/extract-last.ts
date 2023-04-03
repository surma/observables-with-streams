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
import { extractLast, fromIterable, range } from "../../src/index.ts";
import { assertEquals } from "../utils.ts";

Deno.test("extractLast()", async function (t) {
  await t.step("returns the last item", async function () {
    const item = await extractLast(range(1, 9));
    assertEquals(item, 9);
  });

  await t.step("throws if no items are emitted", function () {
    return new Promise((resolve, reject) => {
      extractLast(fromIterable([]))
        .then(() => reject("extractLast() did not throw"))
        .catch(() => resolve());
    });
  });
});
