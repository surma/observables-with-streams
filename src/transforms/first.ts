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

import { external, EOF } from "../sources/external.js";
import { Transform } from "../types.js";
import { extractFirst, discard } from "../sinks/index.js";

/**
 * Returns a `Transform` that emits the first item in an observable.
 * The source observable will be drained after.
 *
 * @typeparam T Type of items emitted by the observable.
 * @returns Transform that emits the first item emitted by the
 * observable.
 */
export function first<T>(): Transform<T> {
  const { readable, writable } = new TransformStream<T, T>(
    undefined,
    { highWaterMark: 0 },
    { highWaterMark: 0 }
  );
  const { observable, next } = external<T>();
  (async function() {
    const first = await extractFirst(readable);
    next(first);
    next(EOF);
    readable.pipeTo(discard());
  })();
  return { writable, readable: observable };
}
