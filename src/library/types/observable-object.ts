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

  Object.defineProperty(target, 'observableId', {
    enumerable: false,
    writable: false,
    value: observableId,
  });

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

export function extendObservable(target: any, toExtend: any): void {
  let isTargetObservable = isObservable(target);

  for (let key of Object.keys(toExtend)) {
    if (!toExtend.hasOwnProperty(key)) {
      continue;
    }

    if (propertyHasGetterOrSetter(toExtend, key)) {
      let get = getGetter(toExtend, key);
      let set = getSetter(toExtend, key);

      Object.defineProperty(target, key, {
        enumerable: false,
        get,
        set,
      });
    } else {
      target[key] = toExtend[key];

      makePropertyObservable(target, key);
    }

    if (
      !isTargetObservable &&
      (isPrimitiveType(target[key]) || target[key] === null) &&
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
    } else {
      Object.defineProperty(target, key, {
        enumerable: false,
      });
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
