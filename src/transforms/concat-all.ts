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

import { Observable, Transform } from "../types.js";
import { externalPromise } from "../utils.js";

/**
 * Converts a higher-order Observable into a first-order Observable
 * by concatenating the inner Observables in order.
 *
 * @typeparam T Type of items emitted by the inner observables.
 * @returns Transform that emits items from the inner observables.
 */
export function concatAll<T>(): Transform<Observable<T>, T> {
  const { readable, writable } = new TransformStream(
    undefined,
    { highWaterMark: 0 },
    { highWaterMark: 0 }
  );
  return {
    writable: new WritableStream(
      {
        async write(o) {
          await o.pipeTo(writable, { preventClose: true });
        },
        close() {
          writable.getWriter().close();
        }
      },
      { highWaterMark: 0 }
    ),
    readable
  };
}
