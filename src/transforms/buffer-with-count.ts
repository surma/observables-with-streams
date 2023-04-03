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

import { Transform } from "../types.ts";

/**
 * Collects items from the original observable into buffers of size `count`.
 *
 * @typeparam T Type of items emitted by the observable.
 * @param count Max size for the buffers.
 * @returns Transform that emits arrays of items from the original observable.
 */
export function bufferWithCount<T>(count: number): Transform<T, T[]> {
  let buffer: T[] = [];
  return new TransformStream<T, T[]>(
    {
      transform(chunk, controller) {
        buffer.push(chunk);
        if (buffer.length === count) {
          controller.enqueue(buffer);
          buffer = [];
        }
      },
      flush(controller) {
        if (buffer.length > 0) {
          controller.enqueue(buffer);
        }
      },
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 },
  );
}
