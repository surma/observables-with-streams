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

import { Observable, Transform } from "../types.js";

/**
 * Emits the most recently emitted value from the Observable whenever
 * the notifier emits. If no new value has been emitted from the
 * source observable since the last time the  notifier emitted, nothing
 * will be emitted.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param notifier Observable that triggers the sampling of the
 * source observable.
 * @returns Transform that emits whenever the notifier emits, provided
 * the source observable has emitted a new value in the mean time.
 */
export function sample<T>(notifier: Observable<unknown>): Transform<T, T> {
  let lastReceived: T[] = [];
  return new TransformStream<T, T>(
    {
      start(controller) {
        (async () => {
          const reader = notifier.getReader();
          while (true) {
            const { done } = await reader.read();
            if (done) {
              return;
            }
            if (lastReceived.length === 0) {
              continue;
            }
            controller.enqueue(lastReceived.pop()!);
          }
        })();
      },
      transform(chunk, controller) {
        lastReceived[0] = chunk;
      }
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 }
  );
}
