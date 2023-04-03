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

import { Observable } from "../types.ts";
import { external, NextFunc } from "./external.ts";

/**
 * Creates an observable from a function that gets passed the
 * observable's `next()` function.
 *
 * See also {@link external}.
 *
 * @typeparam T Type of items to be emitted by the observable.
 * @param f Function that will be executed with the
 * observable's `next()` function.
 * @returns New observable.
 */
export function fromNext<T>(f: (next: NextFunc<T>) => unknown): Observable<T> {
  const { observable, next } = external<T>();
  f(next);
  return observable;
}
