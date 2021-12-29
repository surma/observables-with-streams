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
import { zip } from "../combiners/zip.ts";

/**
 * Zips items from the original observable with the `other` observable.
 * See {@link zip}.
 *
 * @typeparam S Type of items emitted by the original observable.
 * @typeparam T Type of items emitted by `other`.
 * @param other Other observable to zip with.
 * @returns Transform that emits pairs of items.
 */
export function zipWith<S, T>(other: Observable<T>): Transform<S, [S, T]> {
  const { readable, writable } = new TransformStream<S, S>(
    undefined,
    { highWaterMark: 1 },
    { highWaterMark: 0 },
  );

  return {
    writable,
    readable: zip(readable, other),
  };
}
