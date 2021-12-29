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
import { buffer } from "./buffer.ts";
import { map } from "./map.ts";
import { fromIterable } from "../sources/index.ts";

/**
 * Branches out the source observable as nested observables whenever
 * notifier emits.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param notifier Observable that emits when a branch should be created.
 * @returns Transform that emits an observable with a subset of items from
 * the original observable.
 */
export function window<T>(
  notifier: Observable<unknown>,
): Transform<T, Observable<T>> {
  const { readable, writable } = new TransformStream(
    undefined,
    { highWaterMark: 1 },
    { highWaterMark: 0 },
  );
  return {
    writable,
    readable: readable
      .pipeThrough(buffer<T>(notifier))
      .pipeThrough(map((v) => fromIterable(v))),
  };
}
