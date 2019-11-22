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
 * Resolves with the only element emitted by the observable.
 * If zero or more than one items are emitted, the promise is rejected.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param o Observable to extract from.
 * @returns Promise that resolves with a single item.
 */
export async function single<T>(o: Observable<T>): Promise<T> {
  const reader = o.getReader();
  const { value, done } = await reader.read();
  if (done) {
    throw new Error("Observable finished without emitting any items");
  }
  if (!(await reader.read()).done) {
    throw new Error("Observable emitted more than one item");
  }
  return value;
}
