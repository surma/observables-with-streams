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

import { Observable, Transform } from "../types.js";
import { externalPromise } from "../utils.js";

/**
 * Converts a higher-order Observable into a first-order Observable
 * producing values only from the most recent observable sequence.
 *
 * @typeparam T Type of items emitted by the inner observables.
 * @returns Transform that emits items from the most recent observable
 * emitted by the outer observable.
 */
export function switchAll<T>(): Transform<Observable<T>, T> {
  const lastInnerDone = externalPromise();
  let innerStreamCounter = 0;
  let outerDone = false;
  let currentReader: ReadableStreamReader<T> | null;
  return new TransformStream({
    transform(o, controller) {
      innerStreamCounter++;
      if (currentReader) {
        currentReader.cancel();
      }
      currentReader = o.getReader();
      (async () => {
        const readerCopy = currentReader;
        while (true) {
          try {
            const { value, done } = await readerCopy.read();
            if (done) {
              break;
            }
            controller.enqueue(value);
          } catch (e) {
            break;
          }
        }
        innerStreamCounter--;
        if (innerStreamCounter === 0) {
          currentReader = null;
        }
        if (outerDone) {
          lastInnerDone.resolve();
        }
      })();
    },
    async flush() {
      outerDone = true;
      if (currentReader) {
        await lastInnerDone.promise;
      }
    }
  });
}
