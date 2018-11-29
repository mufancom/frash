import {makeIterable} from '../utils';

import {dependencyManager} from './dependency-manager';
import {idManager} from './id-manager';
import {makeObservable} from './observable';

export class ObservableMap<K, V> implements Map<K, V> {
  [Symbol.toStringTag]: 'Map';

  private id = idManager.generate('observable');

  private _data: Map<K, V>;

  constructor(data?: Map<K, V> | ReadonlyArray<[K, V]>) {
    if (data instanceof Map) {
      for (let item of data.values()) {
        if (typeof item === 'object') {
          makeObservable(item);
        }
      }

      this._data = data;
    } else {
      if (data) {
        for (let item of data) {
          if (typeof item === 'object') {
            makeObservable(item);
          }
        }
      }

      this._data = new Map(data);
    }
  }

  get size(): number {
    this.reportObserved();

    return this._data.size;
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  entries(): IterableIterator<[K, V]> {
    this.reportObserved();

    let nextIndex = 0;

    let keys = Array.from(this.keys());

    return makeIterable({
      next: (): any => {
        if (nextIndex < keys.length) {
          let key = keys[nextIndex++];

          return {
            value: [key, this.get(key)!],
            done: false,
          };
        }

        return {done: true};
      },
    });
  }

  keys(): IterableIterator<K> {
    this.reportObserved();

    return this._data.keys();
  }

  values(): IterableIterator<V> {
    this.reportObserved();

    let nextIndex = 0;

    let keys = Array.from(this.keys());

    return makeIterable({
      next: (): any => {
        return nextIndex < keys.length
          ? {value: this.get(keys[nextIndex++]), done: false}
          : {done: true};
      },
    });
  }

  clear(): void {
    this._data.clear();

    this.trigger();
  }

  delete(key: K): boolean {
    let result = this._data.delete(key);

    if (result) {
      this.trigger();
    }

    return result;
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any,
  ): void {
    this.reportObserved();

    this._data.forEach((value, key, map) => {
      callbackfn(value, key, map);
    }, thisArg);
  }

  get(key: K): V | undefined {
    this.reportObserved();

    return this._data.get(key);
  }

  has(key: K): boolean {
    this.reportObserved();

    return this._data.has(key);
  }

  set(key: K, value: V): this {
    if (typeof value === 'object') {
      makeObservable(value);
    }

    this._data.set(key, value);

    this.trigger();

    return this;
  }

  private reportObserved(): void {
    dependencyManager.collect(this.id);
  }

  private trigger(): void {
    dependencyManager.trigger(this.id);
  }
}