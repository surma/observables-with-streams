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

/**
 * Collects all values from the observable into an array.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param o Observable to collect from.
 * @returns Promise that resolves with an array.
 */
export async function collect<T>(o: Observable<T>): Promise<T[]> {
  let buffer: T[] = [];
  const reader = o.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      return buffer;
    }
    buffer.push(value);
  }
}
