/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import { scan, ScanFunc } from "../transforms/scan.js";
import { last } from "./last.js";

/**
 * Accumulates value, starting with `v0` and applying `f` to each emitted item.
 * If no items are emitted the promise is rejected.
 *
 * @template U Type of result returned from the accumulator.
 * @template T Type of items emitted by the observable.
 * @param o Observable to reduce.
 * @param f Reduce function called with the accumulated value so far and the
 * current item. Should return a new accumulated value.
 * @param v0 Initial value.
 * @returns Promise that resolves with the accumulated value.
 */
export async function reduce<U, T>(
  o: Observable<T>,
  f: ScanFunc<U, T>,
  v0: U
): Promise<U> {
  return last(o.pipeThrough(scan(f, v0)));
}
