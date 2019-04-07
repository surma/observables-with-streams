# Observables with Streams

```
npm install --save owp
```

A collection of observables built with streams.

This library is inspired by [ReactiveX’s operators](http://reactivex.io/documentation/operators.html) and implements a subset of them using [streams](https://streams.spec.whatwg.org).

The goal of this library is to implement observables making as much use of the platform as possible and being highly treeshakeable.

While most browsers have [partial support of streams](https://caniuse.com/#feat=streams) in stable, this library makes heavy use of [TransformStreams](https://streams.spec.whatwg.org/#ts-model), which are currently not well supported.

For a good primer about streams, read this [blog post](https://jakearchibald.com/2016/streams-ftw/) by [Jake Archibald](https://twitter.com/jaffathecake/) (he is aware the title hasn’t aged well).

---

License Apache 2.0
