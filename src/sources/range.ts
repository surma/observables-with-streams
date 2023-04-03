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
import { EOF, external } from "./external.ts";

/**
 * Creates an observable that emits numbers from `start` to `end`.
 *
 * @param start Number to start emitting from, such as `0`.
 * @param end Number to stop emitting at, inclusive.
 * @returns New observable that emits numbers.
 */
export function range(start: number, end: number): Observable<number> {
  const { observable, next } = external<number>();
  const len = Math.abs(end - start);
  const dir = Math.sign(end - start);
  for (let i = 0; i <= len; i++) {
    next(start + i * dir);
  }
  next(EOF);
  return observable;
}
