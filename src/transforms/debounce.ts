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

import { Transform } from "../types.js";

/**
 * Returns a `Transform` where items are only emitted if `ms` milliseconds
 * pass without new a new emit by the source observable. If a new value is
 * emitted, the “cooldown” is restarted and the old value is discarded.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param ms Milliseconds to wait before emitting an item.
 * @returns Transform that emits some items from the original observable.
 */
export function debounce<T>(ms: number): Transform<T> {
  let timeout: number;
  let timeoutP: Promise<unknown>;
  let savedChunk: T;
  return new TransformStream({
    transform(chunk, controller) {
      savedChunk = chunk;
      if (timeout > 0) {
        clearTimeout(timeout);
      }
      timeoutP = new Promise(resolve => {
        // @ts-ignore NodeJS types are interfering here
        timeout = setTimeout(() => {
          controller.enqueue(savedChunk);
          timeout = 0;
          resolve();
        }, ms);
      });
    },
    async flush() {
      await timeoutP;
    }
  });
}
