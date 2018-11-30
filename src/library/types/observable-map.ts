import {convertToObservable, dependencyManager, idManager} from '../core';
import {makeIterable} from '../utils';

import {wrapObservableMethod} from './observable-object';

export class ObservableMap<K = any, V = any> implements Map<K, V> {
  [Symbol.toStringTag]: 'Map';

  readonly observableId = idManager.generate('observable');

  private _data: Map<K, V>;

  constructor(data?: Map<K, V> | ReadonlyArray<[K, V]>) {
    if (data instanceof Map) {
      this._data = data;
    } else {
      this._data = new Map(data);
    }

    for (let [key, value] of this._data) {
      this._data.set(key, convertToObservable(value));
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
    this.reportObserved();

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
    this._data.set(key, convertToObservable(value));

    this.trigger();

    return this;
  }

  private reportObserved(): void {
    dependencyManager.collect(this.observableId);
  }

  private trigger(): void {
    dependencyManager.trigger(this.observableId);
  }
}

export function createObservableMap<K, V>(
  data?: Map<K, V> | ReadonlyArray<[K, V]>,
): ObservableMap<K, V> {
  let map = new ObservableMap(data);

  let handler: ProxyHandler<typeof map> = {
    set(target: any, key, value) {
      if (typeof value === 'function') {
        target[key] = wrapObservableMethod(value, map.observableId);
      } else {
        target[key] = convertToObservable(value);
      }

      dependencyManager.trigger(map.observableId);

      return true;
    },
  };

  return new Proxy(map, handler);
}
