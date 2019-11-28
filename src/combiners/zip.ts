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
 * Zips items from multiple observables.
 * The resulting observable emits items as array tuples.
 *
 * @typeparam T Type of items emitted by the observables.
 * @param os Observables to combine.
 * @returns Observable that emits tuples of items.
 */
export function zip<T1, T2>(
  o1: Observable<T1>,
  o2: Observable<T2>
): Observable<[T1, T2]>;
export function zip<T1, T2, T3>(
  o1: Observable<T1>,
  o2: Observable<T2>,
  o3: Observable<T3>
): Observable<[T1, T2, T3]>;
export function zip<T>(...os: Array<Observable<T>>): Observable<T[]>;
export function zip<T>(...os: Array<Observable<T>>): Observable<T[]> {
  return new ReadableStream<T[]>({
    async start(controller) {
      const readers = os.map(o => o.getReader());
      while (true) {
        const values = await Promise.all(readers.map(r => r.read()));
        if (values.some(({ done }) => done)) {
          break;
        }
        controller.enqueue(values.map(({ value }) => value));
      }
      readers.forEach(r => r.releaseLock());
      controller.close();
    }
  });
}
