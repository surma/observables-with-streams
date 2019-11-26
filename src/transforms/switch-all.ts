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

import { Observable, Transform } from "../types.js";
import { external, EOF } from "../sources/external.js";

/**
 * Converts a higher-order Observable into a first-order Observable
 * producing values only from the most recent observable sequence.
 *
 * @typeparam T Type of items emitted by the inner observables.
 * @returns Transform that emits items from the most recent observable
 * emitted by the outer observable.
 */
export function switchAll<T>(): Transform<Observable<T>, T> {
  const { observable, next } = external<T>();
  const { readable, writable } = new TransformStream<
    Observable<T>,
    Observable<T>
  >();

  const outerReader = readable.getReader();

  outerReader.read().then(async function f({ value: innerObservable, done }) {
    if (done) {
      next(EOF);
      return;
    }
    const nextOuterReader = outerReader.read().then(v => {
      f(v);
      return false;
    });
    const innerReader = innerObservable.getReader();
    let cont = true;
    while (cont) {
      cont = await Promise.race([
        nextOuterReader,
        innerReader.read().then(({ value, done }) => {
          if (done) {
            return false;
          }
          next(value);
          return true;
        })
      ]);
    }
  });

  return { writable, readable: observable };
}
