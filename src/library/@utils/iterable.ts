export function makeIterable<T>(_iterator: Iterator<T>): IterableIterator<T> {
  let iterator = _iterator as any;
  iterator[Symbol.iterator] = self;
  return iterator as any;
}

function self<T>(this: T): T {
  return this;
}
