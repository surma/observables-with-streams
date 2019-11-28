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
import { fromTimer, forEach, discard } from "../../src/index.js";

Mocha.describe("fromTimer()", function() {
  Mocha.it("emits null in the given interval", function(done) {
    const observable = fromTimer(10);
    let list: any[] = [];

    observable.pipeThrough(forEach(v => list.push(v))).pipeTo(discard());
    setTimeout(() => {
      chai.expect(list).to.have.length(4);
      done();
    }, 40);
  });
});
