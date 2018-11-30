import {convertToObservable, dependencyManager, idManager} from '../core';

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

export function extendObservable(target: any, extend: any): void {
  for (let key of Object.keys(extend)) {
    if (!extend.hasOwnProperty(key)) {
      continue;
    }

    target[key] = extend[key];
    makePropertyObservable(target, key);
  }
}

export function makePropertiesObservable<T extends object>(target: T): void {
  for (let key of Object.keys(target)) {
    if (!target.hasOwnProperty(key)) {
      continue;
    }

    makePropertyObservable(target, key);
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
