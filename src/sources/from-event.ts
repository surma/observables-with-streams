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
import { external } from "./external.js";

/**
 * Creates an observable from an `EventTarget`.
 * Each event is turned into an item for the observable.
 *
 * @template K Type of the event target `el`.
 * @template T Type of the events to be emitted, such as `MouseEvent`.
 * @param el Event target to create an observable from.
 * @param name Name of the event to listen to, such as `'click'`.
 * @returns New observable that emits values from the event target.
 */
export function fromEvent<K extends EventTarget, T extends Event = Event>(
  el: K,
  name: string
): Observable<T> {
  const { next, observable } = external<T>();
  el.addEventListener(name, next as any);
  return observable;
}
