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
 * Calls a function for each item emitted by an observable without
 * waiting for the function to return to forward the item.
 * Exceptions thrown by the function will be caught and ignored.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param f Function called with each emitted value.
 * @returns Transform that emits the same items as the original observable.
 */
export function forEach<T>(
  f: (x: T) => Promise<unknown> | unknown
): Transform<T> {
  return new TransformStream<T, T>(
    {
      async transform(chunk, controller) {
        controller.enqueue(chunk);
        try {
          await f(chunk);
        } catch (e) {}
      }
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 }
  );
}
