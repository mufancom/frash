import {DoubleKeyMap} from './@utils';
import {Computed} from './computed';
import {Observable, makeObservable} from './observable';

export function observable<T extends object, K extends keyof T>(
  target: T,
  key: K,
): void {
  let observableMap = new DoubleKeyMap<T, K, Observable>();

  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get: function(this: T) {
      let observable = observableMap.get(this, key);

      if (!observable) {
        return undefined;
      }

      return observable.get();
    },
    set: function(this: T, value: any) {
      let observable = observableMap.get(this, key);

      if (!observable) {
        observable = new Observable(value);
        observableMap.set(this, key, observable);
      }

      if (typeof value === 'object') {
        makeObservable(value);
      }

      return observable.set(value);
    },
  });
}

export function computed<T extends object>(
  _target: T,
  name: string,
  descriptor: PropertyDescriptor,
): void {
  let computedMap = new DoubleKeyMap<T, string, Computed>();

  let oldGetter = descriptor.get!;

  if (!oldGetter) {
    throw new Error(`\`${name}\` doesn't have a getter`);
  }

  function getter(this: T): any {
    let computed = computedMap.get(this, name);

    if (!computed) {
      computed = new Computed(this, oldGetter);
      computedMap.set(this, name, computed);
    }

    return computed.get();
  }

  descriptor.get = getter;
}
