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

import { Observable, Transform } from "../types.ts";

/**
 * Collects items from the original observable into buffers until the
 * notifier emits. If no items have been buffered since the last time
 * the notifier emitted, nothing will be emitted. Closing the emitter
 * will emit the remaining buffer.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param notifier Observable that emits when the buffer should be emitted.
 * @returns Transform that emits arrays of items from the original observable.
 */
export function buffer<T>(notifier: Observable<unknown>): Transform<T, T[]> {
  let buffer: T[] = [];
  return new TransformStream<T, T[]>(
    {
      start(controller) {
        (async () => {
          const reader = notifier.getReader();
          while (true) {
            const { done } = await reader.read();
            if (buffer.length > 0) {
              controller.enqueue(buffer);
              buffer = [];
            }
            if (done) {
              controller.terminate();
              return;
            }
          }
        })();
      },
      transform(chunk) {
        buffer.push(chunk);
      },
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 },
  );
}
