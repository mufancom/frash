export function makeIterable<T>(iterator: Iterator<T>): IterableIterator<T> {
  (iterator as any)[Symbol.iterator] = self;
  return iterator as any;
}

function self(this: any) {
  return this;
}
