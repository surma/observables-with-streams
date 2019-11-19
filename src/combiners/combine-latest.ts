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

export function combineLatest<T1, T2>(
  o1: Observable<T1>,
  o2: Observable<T2>
): Observable<[T1, T2]>;
export function combineLatest<T1, T2, T3>(
  o1: Observable<T1>,
  o2: Observable<T2>,
  o3: Observable<T3>
): Observable<[T1, T2, T3]>;
export function combineLatest<T>(...os: Array<Observable<T>>): Observable<T[]>;
export function combineLatest<T>(...os: Array<Observable<T>>): Observable<T[]> {
  const hasValue = new Set<ReadableStreamDefaultReader>();
  const latestValue: Array<T | null> = os.map(() => null);
  return new ReadableStream<T[]>({
    async start(controller) {
      const forwarders = os.map(async (o, idx) => {
        const reader = o.getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            return;
          }
          latestValue[idx] = value;
          hasValue.add(reader);
          if (hasValue.size === os.length) {
            controller.enqueue([...latestValue as T[]]);
          }
        }
      });
      await Promise.all(forwarders);
      controller.close();
    }
  });
}
