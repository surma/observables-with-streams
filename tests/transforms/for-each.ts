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
import { collect, forEach, fromIterable, range } from "../../src/index.ts";
import { assertEquals, waitTask } from "../utils.ts";

Deno.test("forEach()", async function (t) {
  await t.step("executes for each item", async function () {
    const iterable = [1, 2, 3];
    let callCount = 0;
    const list = await collect(
      fromIterable(iterable).pipeThrough(
        forEach((x) => {
          callCount++;
          return x + 1;
        }),
      ),
    );

    assertEquals(list, iterable);
    assertEquals(callCount, iterable.length);
  });

  await await t.step("waits until item has been processed", function () {
    return new Promise((resolve, reject) => {
      let processing = false;
      collect(
        range(1, 4).pipeThrough(
          forEach(async () => {
            if (processing) {
              reject("Next item got processed before previous was done");
            }
            processing = true;
            await waitTask();
            processing = false;
          }),
        ),
      ).then((list) => {
        assertEquals(list, [1, 2, 3, 4]);
        resolve();
      });
    });
  });

  await t.step("does not fail when function throws", async function () {
    const list = await collect(
      range(1, 4).pipeThrough(
        forEach(() => {
          throw Error("LOL");
        }),
      ),
    );

    assertEquals(list, [1, 2, 3, 4]);
  });
});
