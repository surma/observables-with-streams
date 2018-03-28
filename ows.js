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

export function from(el, ev) {
  return new ReadableStream({
    start(controller) {
      this.f = function(ev) {
        controller.enqueue(ev);
      }
      el.addEventListener(ev, this.f);
    },
    cancel() {
      el.removeEventListener(ev, this.f);
    }
  });
}

export function just(item) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(item);
      controller.close();
    },
  });
}

export function repeat(items) {
  let i = 0;
  if (!Array.isArray(items))
    items = [items];
  return new ReadableStream({
    pull(controller) {
      controller.enqueue(items[i]);
      i = (i + 1) % items.length;
    },
  });
}

export function countUp() {
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      controller.enqueue(i++);
    },
  });
}

export function timer(ms) {
  return new ReadableStream({
    start(controller) {
      setInterval(_ => controller.enqueue(), ms);
    },
  });
}

export function delay(ms) {
  return new TransformStream({
    transform(item, controller) {
      setTimeout(_ => controller.enqueue(item), ms);
    }
  })
}

export function map(f) {
  return new TransformStream({
    transform(item, controller) {
      controller.enqueue(f(item));
    }
  });
}

export function filter(f) {
  return new TransformStream({
    transform(item, controller) {
      if (f(item))
        controller.enqueue(item);
    }
  });
}

export function take(n) {
  return new TransformStream({
    start(controller) {
      if (n <= 0)
        controller.terminate();
    },
    transform(item, controller) {
      controller.enqueue(item);
      n--
      if (n <= 0)
        controller.terminate();
    }
  });
}

export function takeLast(n) {
  const buffer = new Array(n);
  return new TransformStream({
    transform(item) {
      buffer.push(item);
      buffer.shift();
    },
    flush(controller) {
      buffer.forEach(item => controller.enqueue(item));
    }
  });
}

export function skip(n) {
  return new TransformStream({
    transform(item, controller) {
      if (n > 0) {
        n--;
        return;
      }
      controller.enqueue(item);
    }
  });
}

export function skipLast(n) {
  const buffer = [];
  return new TransformStream({
    transform(item, controller) {
      buffer.push(item);
      if (buffer.length == n+1)
        controller.enqueue(buffer.shift());
    }
  });
}

export function merge(...os) {
  return new ReadableStream({
    async start(controller) {
      const rs =
        os
          .map(o => o.getReader())
          .map(async r => {
            while (true) {
              const {value, done} = await r.read();
              if (done)
                return;
              controller.enqueue(value);
            }
          });
      await Promise.all(rs);
      controller.close();
    },
  });
}

export function concat(...os) {
  const ts = new TransformStream();
  (async _ => {
    for (const o of os)
      await o.pipeTo(ts.writable, {preventClose: true});
    ts.writable.getWriter().close();
  })();
  return ts.readable;
}

export function zip(...os) {
  return new ReadableStream({
    start() {
      this.rs = os.map(o => o.getReader());
    },
    async pull(controller) {
      const values = await Promise.all(this.rs.map(r => r.read()));
      if (values.some(v => v.done)) {
        this.rs.map(r => r.releaseLock());
        controller.close();
      }
      controller.enqueue(values.map(v => v.value));
    }
  });
}
