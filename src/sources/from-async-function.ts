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
import { fromPromise } from "./from-promise.js";

/**
 * Creates an observable from an asynchronous function. The observable
 * emits exactly one value when once the function returns.
 *
 * @typeparam T Type of the promise value.
 * @param f Async function that will be awaited.
 * @returns New observable that emits the value the async function returns.
 */
export function fromAsyncFunction<T>(f: () => Promise<T>): Observable<T> {
  return fromPromise(f());
}
