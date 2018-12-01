/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import { external, combineLatest, map, collect, EOF } from "../../src/index.js";
import { waitTicks } from "../utils.js";

Mocha.describe("combineLatest()", function() {
  Mocha.it(
    "combines the latest values of multiple observables",
    async function() {
      const { observable: o1, next: n1 } = external<number>();
      const { observable: o2, next: n2 } = external<number>();
      const { observable: o3, next: n3 } = external<number>();

      const list = collect(
        combineLatest(o1, o2, o3)
          .pipeThrough(map(async ([a, b, c]) => a + b + c))
      );

      const steps = [
        () => n1(0),
        () => n1(1),
        () => n2(10),
        () => n3(100),
        () => n1(2),
        () => n2(20),
        () => n2(30),
        () => n3(200),
        () => n1(3),
        () => n1(4),
        () => n1(EOF),
        () => n2(40),
        () => n3(300),
        () => n3(EOF),
        () => n2(50),
        () => n2(EOF)
      ];

      for (const step of steps) {
        step();
        await waitTicks();
      }

      chai
        .expect(await list)
        .to.deep.equal([111, 112, 122, 132, 232, 233, 234, 244, 344, 354]);
    }
  );
});
