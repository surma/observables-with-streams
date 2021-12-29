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
import { collect, combineLatestWith, EOF, external } from "../../src/index.ts";
import { assertEquals, waitTicks } from "../utils.ts";

Deno.test("combineLatestWith()", async function (t) {
  await t.step(
    "combines the latest values of 2 observables",
    async function () {
      const { observable: o1, next: n1 } = external<number>();
      const { observable: o2, next: n2 } = external<number>();

      const list = collect(o1.pipeThrough(combineLatestWith(o2)));

      const steps = [
        () => n1(0),
        () => n1(1),
        () => n2(0),
        () => n2(1),
        () => n2(2),
        () => n1(2),
        () => n1(3),
        () => n1(EOF),
        () => n2(3),
        () => n2(EOF),
      ];

      for (const step of steps) {
        step();
        await waitTicks();
      }

      assertEquals(await list, [
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 2],
        [3, 2],
        [3, 3],
      ]);
    },
  );
});
