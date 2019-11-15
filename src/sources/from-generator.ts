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
import { fromIterable } from "./from-iterable.js";

type GeneratorFunc<T> = () => IterableIterator<T>;

/**
 * Creates an observable from a generator that takes no arguments.
 *
 * @template T Type of items to be emitted by the observable.
 * @param f Generator function to create an observable from.
 * @returns New observable that emits values from the generator.
 */
export function fromGenerator<T>(f: GeneratorFunc<T>): Observable<T> {
  return fromIterable(f());
}
