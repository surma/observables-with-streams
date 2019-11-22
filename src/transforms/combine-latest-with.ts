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

import { Transform, Observable } from "../types.js";
import { combineLatest } from "../combiners/combine-latest.js";

export function combineLatestWith<S, T1>(
  other: Observable<T1>
): Transform<S, [S, T1]>;
export function combineLatestWith<S, T1, T2>(
  o1: Observable<T1>,
  o2: Observable<T2>
): Transform<S, [S, T1, T2]>;
export function combineLatestWith<T>(
  ...others: Observable<T>[]
): Transform<T, T[]>;
export function combineLatestWith<T>(
  ...others: Observable<T>[]
): Transform<T, T[]> {
  const { readable, writable } = new TransformStream<T, T>();
  return { writable, readable: combineLatest(readable, ...others) };
}
