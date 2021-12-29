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
export {
  assert,
  assertEquals,
} from "https://deno.land/std@0.118.0/testing/asserts.ts";

export async function waitTicks(n = 5) {
  for (let i = 0; i < n; i++) {
    await 0;
  }
}

let uid = 0;
const { port1, port2 } = new MessageChannel();
port2.start();
export function waitTask() {
  const localId = uid++;
  port1.postMessage(localId);
  return new Promise<null>((resolve) => {
    port2.addEventListener("message", function f(ev) {
      if (ev.data !== localId) {
        return;
      }
      port2.removeEventListener("message", f);
      resolve(null);
    });
  });
}

export function waitMs(ms = 5) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

if (globalThis.ReadableStream === undefined) {
  const streams = await import("stream/web");
  // @ts-ignore no typings for "stream/web"
  globalThis.ReadableStream = streams.ReadableStream;
  // @ts-ignore no typings for "stream/web"
  globalThis.WritableStream = streams.WritableStream;
  // @ts-ignore no typings for "stream/web"
  globalThis.TransformStream = streams.TransformStream;
}
