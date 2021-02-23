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

import { Observable } from "../types.js";

/**
 * Takes in multiple observables but only emits items from the first observable
 * to emit.
 *
 * @typeparam T Type of items emitted by the observables.
 * @param os Observables to race.
 * @returns Observable that emits items from one of the given observables.
 */
export function amb<T>(...os: Array<Observable<T>>): Observable<T> {
  return new ReadableStream(
    {
      async start(controller) {
        const readers = os.map(o => o.getReader());
        const reads = readers.map(async (r, i) => [await r.read(), i] as const);
        let [{ value, done }, i] = await Promise.race(reads);
        reads
          .filter((_, j) => j !== i)
          .map(async (r, j) => {
            await r;
            readers[j].releaseLock();
          });
        const [fastestObs] = readers.slice(i, i + 1);
        while (true) {
          if (done) {
            return controller.close();
          }
          controller.enqueue(value!);
          ({ value, done } = await fastestObs.read());
        }
      }
    },
    { highWaterMark: 0 }
  );
}
