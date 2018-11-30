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

export type Observable<T> = ReadableStream<T>;
export type Transform<S, T = S> = TransformStream<S, T>;

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

export function fromEvent<K extends EventTarget, T extends Event = Event>(
  el: K,
  name: string
): Observable<T> {
  const { next, observable } = external<T>();
  el.addEventListener(name, next as any);
  return observable;
}

export function fromIterable<T>(
  it: Iterable<T> | IterableIterator<T>
): Observable<T> {
  const { next, observable } = external<T>();
  for (const v of it) {
    next(v);
  }
  next(EOF);
  return observable;
}

type GeneratorFunc<T> = () => IterableIterator<T>;
export function fromGenerator<T>(it: GeneratorFunc<T>): Observable<T> {
  const { next, observable } = external<T>();
  for (const v of it()) {
    next(v);
  }
  next(EOF);
  return observable;
}

export function filter<T>(f: (x: T) => boolean): Transform<T> {
  return new TransformStream<T, T>({
    transform(chunk, controller) {
      if (f(chunk)) {
        controller.enqueue(chunk);
      }
    }
  });
}

export function map<S, T>(f: (x: S) => Promise<T>): Transform<S, T> {
  return new TransformStream<S, T>({
    async transform(chunk, controller) {
      controller.enqueue(await f(chunk));
    }
  });
}

export function zipWith<S, T>(other: Observable<T>): Transform<S, [S, T]> {
  const reader = other.getReader();
  return new TransformStream<S, [S, T]>({
    async transform(chunk, controller) {
      const { value, done } = await reader.read();
      if (done) {
        return controller.terminate();
      }
      controller.enqueue([chunk, value]);
    }
  });
}

export function combineLatestWith<S, T>(
  other: Observable<T>
): Transform<S, [S, T]> {
  const writtenStreams = new Set();
  const latestValue: [S, T] = [0, 0] as any;
  let rscResolver: (rsc: ReadableStreamDefaultController) => void;
  const rsc = new Promise<ReadableStreamDefaultController>(
    resolve => (rscResolver = resolve)
  );

  function keepLatest(index: number) {
    return new WritableStream({
      async write(chunk) {
        writtenStreams.add(this);
        latestValue[index] = chunk;
        if (writtenStreams.size === 2) {
          (await rsc).enqueue([...latestValue]);
        }
      },
      async close() {
        (await rsc).close();
      }
    });
  }

  other.pipeTo(keepLatest(1));
  return {
    writable: keepLatest(0),
    readable: new ReadableStream({
      start(controller) {
        rscResolver(controller);
      }
    })
  };
}

export function bufferWithCount<T>(count: number): Transform<T, T[]> {
  let buffer: T[] = [];
  return new TransformStream<T, T[]>({
    async transform(chunk, controller) {
      buffer.push(chunk);
      if (buffer.length === count) {
        controller.enqueue(buffer);
        buffer = [];
      }
    },
    flush(controller) {
      if (buffer.length > 0) {
        controller.enqueue(buffer);
      }
    }
  });
}

export function forEach<T>(f: (x: T) => void): Transform<T> {
  return new TransformStream<T, T>({
    async transform(chunk, controller) {
      controller.enqueue(chunk);
      f(chunk);
    }
  });
}

export function sink() {
  return new WritableStream();
}

export async function first<T>(o: Observable<T>): Promise<T> {
  const reader = o.getReader();
  const { value, done } = await reader.read();
  if (done) {
    throw new Error("Observable finished without emitting any items");
  }
  reader.releaseLock();
  return value;
}

export async function single<T>(o: Observable<T>): Promise<T> {
  const reader = o.getReader();
  const { value, done } = await reader.read();
  if (done) {
    throw new Error("Observable finished without emitting any items");
  }
  if (!(await reader.read()).done) {
    throw new Error("Observable emitted more than one item");
  }
  return value;
}

export async function collect<T>(o: Observable<T>): Promise<T[]> {
  let buffer: T[] = [];
  const reader = o.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      return buffer;
    }
    buffer.push(value);
  }
}
