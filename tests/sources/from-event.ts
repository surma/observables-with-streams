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
import { fromEvent, EOF } from "../../src/index.js";

Mocha.describe("fromEvent()", function() {
  Mocha.it("emits on events", async function() {
    const { port1, port2 } = new MessageChannel();
    const observable = fromEvent<MessagePort, MessageEvent<number>>(port2, "message");
    port2.start();
    port1.postMessage(1);
    port1.postMessage(2);
    const reader = observable.getReader();
    let msg: MessageEvent<number>;
    msg = (await reader.read()).value!;
    chai.expect(msg.data).to.equal(1);
    msg = (await reader.read()).value!;
    chai.expect(msg.data).to.equal(2);
  });
});
