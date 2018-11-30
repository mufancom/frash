import {
  createObservableArray,
  createObservableMap,
  createObservableObject,
} from '../types';

export function convertToObservable<T>(target: T): T {
  if (isObservable(target)) {
    return target;
  }

  if (Array.isArray(target)) {
    return createObservableArray(target) as any;
  } else if (target instanceof Map) {
    return createObservableMap(target) as any;
  } else if (typeof target === 'object') {
    return createObservableObject(target as any);
  }

  return target;
}

export function isObservable(target: any): boolean {
  return typeof target === 'object' && 'observableId' in target;
}
