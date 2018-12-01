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

export const EOF = Symbol();
export type NextFunc<T> = (v: T | typeof EOF) => void;

export function external<T>() {
  let next: NextFunc<T>;
  const observable = new ReadableStream<T>({
    async start(controller) {
      next = (v: T | typeof EOF) => {
        if (v === EOF) {
          return controller.close();
        }
        controller.enqueue(v);
      };
    }
  });
  return { observable, next: next! };
}
