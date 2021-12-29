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
import { combineLatest } from "../combiners/combine-latest.ts";

/**
 * Combines items from the original observable with the other observables.
 * See {@link combineLatest}.
 *
 * @typeparam S Type of items emitted by the original observable.
 * @typeparam T Type of items emitted by `other`.
 * @param others Other observables to combine with.
 * @returns Transform that emits tuples of items.
 */
export function combineLatestWith<S, T1>(
  other: Observable<T1>,
): Transform<S, [S, T1]>;
export function combineLatestWith<S, T1, T2>(
  o1: Observable<T1>,
  o2: Observable<T2>,
): Transform<S, [S, T1, T2]>;
export function combineLatestWith<T>(
  ...others: Observable<T>[]
): Transform<T, T[]>;
export function combineLatestWith<T>(
  ...others: Observable<T>[]
): Transform<T, T[]> {
  const { readable, writable } = new TransformStream<T, T>(
    undefined,
    { highWaterMark: 1 },
    { highWaterMark: 0 },
  );
  return { writable, readable: combineLatest(readable, ...others) };
}
