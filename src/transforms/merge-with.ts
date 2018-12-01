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
import { map } from "./map.js";

export function mergeWith<S, T>(other: Observable<T>): Transform<S, S | T> {
  let rscResolver: (rsc: ReadableStreamDefaultController) => void;
  const rsc = new Promise<ReadableStreamDefaultController>(
    resolve => (rscResolver = resolve)
  );

  const closedStreams = new Set();
  function closeOutputStream() {
    return new WritableStream({
      async close() {
        closedStreams.add(this);
        if (closedStreams.size === 2) {
          (await rsc).close();
        }
      }
    });
  }

  function forwardToOutputStream<Q extends S | T>(r: ReadableStream<Q>) {
    r.pipeThrough(map(async chunk => (await rsc).enqueue(chunk))).pipeTo(
      closeOutputStream()
    );
  }

  const { readable, writable } = new TransformStream();
  forwardToOutputStream(readable);
  forwardToOutputStream(other);
  return {
    writable,
    readable: new ReadableStream({
      start(controller) {
        rscResolver(controller);
      }
    })
  };
}
