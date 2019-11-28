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
 * Returns a `Transform` that emits the first `n` items from the original
 * observable.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param n Maximum number of items to emit.
 * @returns Transform that emits some items from the original observable.
 */
export function take<T>(n: number): Transform<T> {
  return new TransformStream<T, T>({
    transform(chunk, controller) {
      if (n > 0) {
        controller.enqueue(chunk);
      }
      if (--n <= 0) {
        controller.terminate();
      }
    }
  });
}
