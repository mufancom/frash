import {Observable, makeObservable} from '../core';
import {DoubleKeyMap} from '../utils';

export function observable<T extends object, K extends keyof T>(
  target: T,
  key: K,
): void {
  let observableMap = new DoubleKeyMap<T, K, Observable>();

  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get(this: T) {
      let observable = observableMap.get(this, key);

      if (!observable) {
        return undefined;
      }

      return observable.get();
    },
    set(this: T, value: any) {
      let observable = observableMap.get(this, key);

      if (!observable) {
        observable = new Observable(value);
        observableMap.set(this, key, observable);
      }

      if (typeof value === 'object') {
        makeObservable(value);
      }

      observable.set(value);
    },
  });
}
