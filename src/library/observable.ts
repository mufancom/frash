import {dependencyManager, idManager} from './@core';

export class Observable {
  private id = idManager.generate('observable');

  private value: any;

  constructor(target: any) {
    if (isPrimitive(target)) {
      this.value = target;
    } else if (isProxyFit(target)) {
      this.value = this.wrapWithProxy(target);
    }
  }

  get(): any {
    dependencyManager.collect(this.id);
    return this.value;
  }

  trigger(): void {
    dependencyManager.trigger(this.id);
  }

  private wrapWithProxy(target: any, visited: any[] = []): any {
    return new Proxy(target, {
      set: (object, key, value) => {
        object[key] = value;
        this.trigger();
        return true;
      },
      get: (object, key) => {
        let value = object[key];

        // Visited set is to avoid circle reference
        if (isProxyFit(value) && !visited.includes(value)) {
          return this.wrapWithProxy(value);
        }

        return value;
      },
    });
  }
}

export type PrimitiveType = string | number | boolean | null | undefined;

export function isPrimitive(value: any): value is PrimitiveType {
  return (
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'undefined' ||
    value === null
  );
}

export type ProxyFitType = object | any[];

export function isProxyFit(value: any): value is ProxyFitType {
  return typeof value === 'object' || Array.isArray(value);
}
