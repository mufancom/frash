import {convertToObservable} from '../core';
import {
  ObservableArray,
  ObservableMap,
  ObservableValue,
  createObservableArray,
  createObservableMap,
  createObservableObject,
} from '../types';
import {DoubleKeyMap} from '../utils';

function observableDecorator<T extends object, K extends keyof T>(
  target: T,
  key: K,
): void {
  let observableMap = new DoubleKeyMap<T, K, ObservableValue>();

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
        observable = new ObservableValue(value);
        observableMap.set(this, key, observable);
      }

      observable.set(convertToObservable(value));
    },
  });
}

export function observable<T extends object>(target: T): T;
export function observable<T extends object, K extends keyof T>(
  target: T,
  key: K,
): void;
export function observable<T extends object, K extends keyof T>(
  target: T,
  key?: keyof T,
): T | void {
  if (!key) {
    return convertToObservable(target);
  }

  observableDecorator(target, key);
}

export namespace observable {
  export function box(): ObservableValue;
  export function box<T = any>(value: T): ObservableValue<T>;
  export function box<T>(value?: T): any {
    return new ObservableValue(value);
  }

  export function array(): ObservableArray;
  export function array<T = any>(value: ArrayLike<T>): ObservableArray<T>;
  export function array<T = any>(
    value?: ArrayLike<T> | undefined,
  ): ObservableArray {
    return createObservableArray(value);
  }

  export function map<K = any, V = any>(
    value?: Map<K, V> | ReadonlyArray<[K, V]>,
  ): ObservableMap<K, V> {
    return createObservableMap(value);
  }

  export function object(): any;
  export function object<T = any>(value: T): T;
  export function object(value: any = {}): any {
    return createObservableObject(value);
  }
}
