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

import { Observable } from "../types.js";

/**
 * Creates an output Observable which sequentially emits all values from
 * given Observable and then moves on to the next.
 *
 * @typeparam T Type of items emitted by the observables.
 * @param os Observables to concatenate.
 * @returns Observable that emits items from all observables.
 */
export function concat<T>(...os: Array<Observable<T>>): Observable<T> {
  const { writable, readable } = new TransformStream<T, T>();
  (async function() {
    for (const o of os) {
      await o.pipeTo(writable, { preventClose: true });
    }
    writable.getWriter().close();
  })();
  return readable;
}
