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

import { Transform, Observable } from "../types.js";

export function combineLatestWith<S, T>(
  other: Observable<T>
): Transform<S, [S, T]> {
  const writtenStreams = new Set();
  const latestValue: [S, T] = [0, 0] as any;
  let rscResolver: (rsc: ReadableStreamDefaultController) => void;
  const rsc = new Promise<ReadableStreamDefaultController>(
    resolve => (rscResolver = resolve)
  );

  function keepLatest(index: number) {
    return new WritableStream({
      async write(chunk) {
        writtenStreams.add(this);
        latestValue[index] = chunk;
        if (writtenStreams.size === 2) {
          (await rsc).enqueue([...latestValue]);
        }
      },
      async close() {
        (await rsc).close();
      }
    });
  }

  other.pipeTo(keepLatest(1));
  return {
    writable: keepLatest(0),
    readable: new ReadableStream({
      start(controller) {
        rscResolver(controller);
      }
    })
  };
}
