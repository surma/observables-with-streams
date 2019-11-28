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
import { externalPromise } from "../utils.js";

/**
 * Converts a higher-order Observable into a first-order Observable by
 * dropping inner Observables while the previous inner Observable has
 * not yet completed.
 *
 * @typeparam T Type of items emitted by the inner observables.
 * @returns Transform that emits items from the first observable until
 * it is exhausted, then continues with the next observable emitted.
 */
export function exhaust<T>(): Transform<Observable<T>, T> {
  const lastInnerDone = externalPromise();
  let outerDone = false;
  const { readable, writable } = new TransformStream<
    Observable<T>,
    Observable<T>
  >();
  let currentReader: ReadableStreamReader<T> | null;
  return {
    writable,
    readable: new ReadableStream<T>({
      async start(controller) {
        const reader = readable.getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            outerDone = true;
            if (currentReader) {
              await lastInnerDone.promise;
            }
            controller.close();
            return;
          }

          if (currentReader) {
            continue;
          }
          currentReader = value.getReader();
          (async () => {
            const readerCopy = currentReader;
            while (true) {
              const { value, done } = await readerCopy!.read();
              if (done) {
                if (outerDone) {
                  lastInnerDone.resolve();
                }
                currentReader = null;
                return;
              }
              controller.enqueue(value);
            }
          })();
        }
      }
    })
  };
}
