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
import { fromGenerator } from "../sources/from-generator.js";
import { external, EOF } from "../sources/external.js";
import { zipWith } from "./zip-with.js";
import { map } from "./map.js";
import { forEach } from "./for-each.js";
import { filter } from "./filter.js";
import { distinct } from "./distinct.js";
import { combineLatestWith } from "./combine-latest-with.js";
import { mergeWith } from "./merge-with.js";

function* uid() {
  while (true) {
    yield new Array(16)
      .fill(0)
      .map(() => (Math.floor(Math.random() * 256) + 0x100).toString(16))
      .join("");
  }
}

export function debounce<T>(ms: number): Transform<T> {
  const { readable, writable } = new TransformStream<T, T>();
  const { observable: latestObs, next } = external<T>();
  let latestDiscardedValue: T;
  let hasDiscardedValue = false;
  let isOnCooldown = false;

  return {
    writable,
    readable: readable
      .pipeThrough(
        new TransformStream({
          flush() {
            next(EOF);
          }
        })
      )
      .pipeThrough(mergeWith(latestObs))
      .pipeThrough(
        map<T, [T, boolean]>(async v => {
          if (!isOnCooldown) {
            isOnCooldown = true;
            setTimeout(() => {
              isOnCooldown = false;
              if (hasDiscardedValue) {
                next(latestDiscardedValue);
                hasDiscardedValue = false;
              }
            }, ms);
            return [v, true];
          } else {
            latestDiscardedValue = v;
            hasDiscardedValue = true;
            return [v, false];
          }
        })
      )
      .pipeThrough(filter(([, b]) => b))
      .pipeThrough(map(async ([v]) => v))
  };
}
