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

import { Observable } from "../types.ts";

/**
 * Merges multiple observables by emitting all items from all the observables.
 * Items are emitted in the order they appear.
 *
 * @typeparam T Type of items emitted by the observables.
 * @param os Observables to combine.
 * @returns Observable that emits items from all observables.
 */
export function merge<T>(...os: Array<Observable<T>>): Observable<T> {
  return new ReadableStream<T>(
    {
      async start(controller) {
        const forwarders = os.map(async (o) => {
          const reader = o.getReader();
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              return;
            }
            controller.enqueue(value!);
          }
        });
        await Promise.all(forwarders);
        controller.close();
      },
    },
    { highWaterMark: 0 },
  );
}
