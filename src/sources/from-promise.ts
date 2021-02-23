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

/**
 * Creates an observable from a promise, that emits exactly one value when
 * the promise resolves.
 *
 * @typeparam T Type of the promise value.
 * @param p Promise that will be awaited.
 * @returns New observable that emits the value the promise settles with.
 */
export function fromPromise<T>(p: Promise<T>): Observable<T> {
  return new ReadableStream(
    {
      async start(controller) {
        controller.enqueue(await p);
        controller.close();
      }
    },
    { highWaterMark: 0 }
  );
}
