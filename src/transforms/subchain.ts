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

/**
 * Returns a `Transform` that applies `f` to the observable.
 *
 * @example
 * `subchain()` can be used to create logical groups in a longer chain
 * or to make parts of a chain reusable.
 *
 * ```typescript
 * ows
 *   .fromEvent(button, "click")
 *   .pipeThrough(
 *     ows.subchain(o =>
 *       o
 *         .pipeThrough(ows.map(() => fetch("/stockData")))
 *         .pipeThrough(ows.map(r => r.json()))
 *         .pipeThrough(ows.filter(data => data.tags.contains(importTag)))
 *     )
 *   )
 *   .pipeTo(
 *     ows.discard(data => {
 *       // ...
 *     })
 *   );
 * ```
 *
 * @typeparam S Type of items emitted by the original observable.
 * @typeparam T Type of items returned by the observable `f` returns.
 * @param f Function that will be applied to the observable.
 * @returns Transform that applies `f` to the observable.
 */
export function subchain<S, T>(
  f: (x: Observable<S>) => Observable<T>
): Transform<S, T> {
  const { readable, writable } = new TransformStream(
    undefined,
    { highWaterMark: 1 },
    { highWaterMark: 0 }
  );
  return {
    writable,
    readable: f(readable)
  };
}
