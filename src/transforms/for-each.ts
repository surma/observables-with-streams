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

import { Transform } from "../types.js";

/**
 * Calls a function for each item emitted by an observable.
 * Returns a `Transform` that emits the same items.
 *
 * @template T Type of items emitted by the observable.
 * @param f Function called with each emitted value.
 * @returns Transform that emits the same items as the original observable.
 */
export function forEach<T>(f: (x: T) => void): Transform<T> {
  return new TransformStream<T, T>({
    async transform(chunk, controller) {
      controller.enqueue(chunk);
      f(chunk);
    }
  });
}
