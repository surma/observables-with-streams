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
 * Returns a `Transform` that emits all items for which `f` returns true.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param f Function called with each emitted item. If it returns `true`, the
 * item is emitted. Otherwise the item is discarded.
 * @returns Transform that emits some items from the original observable.
 */
export function filter<T>(f: (x: T) => boolean): Transform<T> {
  return new TransformStream<T, T>(
    {
      transform(chunk, controller) {
        if (f(chunk)) {
          controller.enqueue(chunk);
        }
      }
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 }
  );
}
