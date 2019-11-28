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

import { Transform } from "../types.js";

/**
 * Returns a `Transform` with the results of applying the given function
 * to each emitted item of the original observable.
 *
 * @typeparam S Type of items emitted by the original observable.
 * @typeparam T Type of items returned by `f`.
 * @param f Function called with each emitted item. If it returns a promise,
 * the result is awaited then emitted.
 * @returns Transform that emits items produced by `f`.
 */
export function map<S, T>(f: (x: S) => T | Promise<T>): Transform<S, T> {
  return new TransformStream<S, T>({
    async transform(chunk, controller) {
      controller.enqueue(await f(chunk));
    }
  });
}
