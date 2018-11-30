import {
  convertToObservable,
  dependencyManager,
  idManager,
  isObservable,
} from '../core';
import {
  getGetter,
  getSetter,
  isPrimitiveType,
  propertyHasGetterOrSetter,
} from '../utils';

import {ObservableValue} from './observable-value';

export function createObservableObject<T extends object>(target: T): T {
  let observableId = idManager.generate('observable');

  (target as any).observableId = observableId;

  makePropertiesObservable(target);

  let handler: ProxyHandler<T> = {
    set(target: any, key, value) {
      if (typeof value === 'function') {
        target[key] = wrapObservableMethod(value, observableId);
      } else {
        target[key] = convertToObservable(value);
      }

      dependencyManager.trigger(observableId);

      return true;
    },
    get(target: any, key) {
      dependencyManager.collect(observableId);

      return target[key];
    },
  };

  return new Proxy(target, handler);
}

function makePropertyObservable(target: any, key: string): void {
  target[key] = convertToObservable(target[key]);
}

function makePrimitivePropertyObservable(target: any, key: string): void {
  let box = new ObservableValue(target[key]);

  Object.defineProperty(target, key, {
    get() {
      return box.get();
    },
    set(value) {
      box.set(value);
    },
  });
}

export function extendObservable(target: any, extend: any): void {
  let isTargetObservable = isObservable(target);

  for (let key of Object.keys(extend)) {
    if (!extend.hasOwnProperty(key)) {
      continue;
    }

    if (propertyHasGetterOrSetter(extend, key)) {
      let get = getGetter(extend, key);
      let set = getSetter(extend, key);

      Object.defineProperty(target, key, {
        get,
        set,
      });
    } else {
      target[key] = extend[key];

      makePropertyObservable(target, key);
    }

    if (
      !isTargetObservable &&
      isPrimitiveType(target[key]) &&
      !propertyHasGetterOrSetter(target, key)
    ) {
      makePrimitivePropertyObservable(target, key);
    }
  }
}

export function makePropertiesObservable<T extends object>(target: T): void {
  for (let key of Object.keys(target)) {
    if (!target.hasOwnProperty(key)) {
      continue;
    }

    if (!propertyHasGetterOrSetter(target, key)) {
      makePropertyObservable(target, key);
    }
  }
}

export function wrapObservableMethod<T extends Function>(
  target: T,
  observableId: string,
): T {
  let wrapped = (...args: any[]): any => {
    dependencyManager.collect(observableId);

    return target(...args);
  };

  return wrapped as any;
}
