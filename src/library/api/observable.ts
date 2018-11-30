import {convertToObservable} from '../core';
import {ObservableMap, ObservableValue, createObservableObject} from '../types';
import {DoubleKeyMap, PrimitiveType} from '../utils';

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

observable.box = <T extends PrimitiveType>(value: T): ObservableValue<T> => {
  return new ObservableValue(value);
};

observable.map = <K, V>(
  value: Map<K, V> | ReadonlyArray<[K, V]>,
): ObservableMap<K, V> => {
  return new ObservableMap(value);
};

observable.object = <T extends object>(value: T): T => {
  return createObservableObject(value);
};
