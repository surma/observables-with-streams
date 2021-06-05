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
 * Returns a `Transform` that emits the items specified as arguments
 * after te source observable ends.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param vs Values to emit after the source observable ends.
 * @returns Transform that emits the items of `vs` after the
 * source observables ends.
 */
export function endWith<T>(...vs: T[]): Transform<T> {
  return new TransformStream<T, T>(
    {
      flush(controller) {
        for (const v of vs) {
          controller.enqueue(v);
        }
      }
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 }
  );
}
