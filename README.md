# Observables with Streams

A library for observables built with
[WHATWG streams](https://streams.spec.whatwg.org). This library is inspired by
[ReactiveX’s operators](http://reactivex.io/documentation/operators.html) and
implements a subset of them using [streams](https://streams.spec.whatwg.org).

Importing using NPM:

```
npm install --save observables-with-streams
```

Or directlu the browser / Deno:

```js
// JS:
import * as ows from "https://unpkg.com/observables-with-streams@0.6.1/dist/esm/index.js";

// TS (Deno):
import * as ows from "https://deno.land/x/observables-with-streams/src/index.ts";
```

The goal of this library is to implement observables making as much use of the
platform as possible and being highly tree-shakeable.

## Example

```html
<!DOCTYPE html>

<button id="dec">-</button>

<span id="counter">0</span>

<button id="inc">+</button>

<script type="module">
  import * as ows from "observables-with-streams";

  ows.merge(
    ows.fromEvent(
      document.querySelector("#dec")
      "click"
    ).pipeThrough(ows.map(() => -1)),
    ows.fromEvent(
      document.querySelector("#inc")
      "click"
    ).pipeThrough(ows.map(() => 1))
  )
    .pipeThrough(
      ows.scan((v0, v1) => v0 + v1, 0)
    )
    .pipeTo(
      ows.subscribe(
        v => document.querySelector("#counter").textContent = v
      )
    );
</script>
```

## Documentation

<!-- TODO(lucacasonato): link to doc.deno.land -->

## Caveats

While most browsers have
[partial support of streams](https://caniuse.com/#feat=streams) in stable, this
library makes heavy use of
[TransformStreams](https://streams.spec.whatwg.org/#ts-model), which are
currently not well supported. Until browsers catch up, I can recommend
[Mattias Buelens'](https://twitter.com/MattiasBuelens)
[web-streams-polyfill](https://npm.im/web-streams-polyfill).

For a good primer about streams, read this
[blog post](https://jakearchibald.com/2016/streams-ftw/) by
[Jake Archibald](https://twitter.com/jaffathecake/) (he is aware the title
hasn’t aged well).

---

License Apache 2.0
