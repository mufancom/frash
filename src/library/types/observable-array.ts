import {convertToObservable, dependencyManager, idManager} from '../core';

import {wrapObservableMethod} from './observable-object';

export class ObservableArray<T = any, U = any> implements Array<T> {
  [n: number]: T;

  readonly observableId = idManager.generate('observable');

  private _data: T[];

  constructor(
    arrayLike: ArrayLike<T>,
    mapfn?: (v: U, k: number) => T,
    thisArg?: any,
  );
  constructor(...items: T[]);
  constructor(...args: any[]) {
    Object.defineProperty(this, 'observableId', {
      enumerable: false,
    });

    if (args.length === 1 && args[0] instanceof Array) {
      this._data = args[0];
    } else {
      this._data = new Array(...args);
    }

    for (let [index, value] of this._data.entries()) {
      this._data[index] = convertToObservable(value);
    }
  }

  get length(): number {
    this.reportObserved();

    return this._data.length;
  }

  set length(value: number) {
    this._data.length = value;

    this.trigger();
  }

  toString(): string {
    this.reportObserved();

    return this._data.toString();
  }

  toLocaleString(): string {
    this.reportObserved();

    return this._data.toLocaleString();
  }

  pop(): T | undefined {
    this.reportObserved();

    let result = this._data.pop();

    this.trigger();

    return result;
  }

  push(...items: T[]): number {
    this.reportObserved();

    let result = this._data.push(...items);

    this.trigger();

    return result;
  }

  concat(...items: ConcatArray<T>[]): T[];
  concat(...items: (T | ConcatArray<T>)[]): T[];
  concat(...items: any[]): any[] {
    this.reportObserved();

    return this._data.concat(...items);
  }

  join(separator?: string | undefined): string {
    this.reportObserved();

    return this._data.join(separator);
  }

  reverse(): T[] {
    this._data.reverse();

    this.trigger();

    return this as any;
  }

  shift(): T | undefined {
    this.reportObserved();

    let result = this._data.shift();

    this.trigger();

    return result;
  }

  slice(start?: number | undefined, end?: number | undefined): T[] {
    this.reportObserved();

    return this._data.slice(start, end);
  }

  sort(compareFn?: ((a: T, b: T) => number) | undefined): this {
    this._data.sort(compareFn);

    this.trigger();

    return this;
  }

  splice(start: number, deleteCount?: number | undefined): T[];
  splice(start: number, deleteCount: number, ...items: T[]): T[];
  splice(start: any, deleteCount?: any, ...rest: any[]): any[] {
    this.reportObserved();

    let result = this._data.splice(start, deleteCount, ...rest);

    this.trigger();

    return result;
  }

  unshift(...items: T[]): number {
    this.reportObserved();

    let result = this._data.unshift(...items);

    this.trigger();

    return result;
  }

  indexOf(searchElement: T, fromIndex?: number | undefined): number {
    this.reportObserved();

    return this._data.indexOf(searchElement, fromIndex);
  }

  lastIndexOf(searchElement: T, fromIndex?: number | undefined): number {
    this.reportObserved();

    return this._data.lastIndexOf(searchElement, fromIndex);
  }

  every(
    callbackfn: (value: T, index: number, array: T[]) => boolean,
    thisArg?: any,
  ): boolean {
    this.reportObserved();

    return this._data.every(callbackfn, thisArg);
  }

  some(
    callbackfn: (value: T, index: number, array: T[]) => boolean,
    thisArg?: any,
  ): boolean {
    this.reportObserved();

    return this._data.some(callbackfn, thisArg);
  }

  forEach(
    callbackfn: (value: T, index: number, array: T[]) => void,
    thisArg?: any,
  ): void {
    this.reportObserved();

    this._data.forEach(callbackfn, thisArg);
  }

  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any,
  ): U[] {
    this.reportObserved();

    return this._data.map(callbackfn, thisArg);
  }

  filter<S extends T>(
    callbackfn: (value: T, index: number, array: T[]) => value is S,
    thisArg?: any,
  ): S[];
  filter(
    callbackfn: (value: T, index: number, array: T[]) => boolean,
    thisArg?: any,
  ): T[];
  filter(callbackfn: any, thisArg?: any): any {
    this.reportObserved();

    return this._data.filter(callbackfn, thisArg);
  }

  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => T,
    initialValue?: T,
  ): T;
  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => U,
    initialValue: U,
  ): U;
  reduce(callbackfn: any, initialValue?: any): any {
    this.reportObserved();

    return this._data.reduce(callbackfn, initialValue);
  }

  reduceRight(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => T,
    initialValue?: T,
  ): T;
  reduceRight<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => U,
    initialValue: U,
  ): U;
  reduceRight(callbackfn: any, initialValue?: any): any {
    this.reportObserved();

    return this._data.reduceRight(callbackfn, initialValue);
  }

  find<S extends T>(
    predicate: (this: void, value: T, index: number, obj: T[]) => value is S,
    thisArg?: any,
  ): S | undefined;
  find(
    predicate: (value: T, index: number, obj: T[]) => boolean,
    thisArg?: any,
  ): T | undefined;
  find(predicate: any, thisArg?: any): any {
    this.reportObserved();

    return this._data.find(predicate, thisArg);
  }

  findIndex(
    predicate: (value: T, index: number, obj: T[]) => boolean,
    thisArg?: any,
  ): number {
    this.reportObserved();

    return this._data.findIndex(predicate, thisArg);
  }

  fill(value: T, start?: number | undefined, end?: number | undefined): this {
    this._data.fill(value, start, end);

    this.trigger();

    return this;
  }

  copyWithin(target: number, start: number, end?: number | undefined): this {
    this.reportObserved();

    this._data.copyWithin(target, start, end);

    this.trigger();

    return this;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }

  entries(): IterableIterator<[number, T]> {
    this.reportObserved();

    return this._data.entries();
  }

  keys(): IterableIterator<number> {
    this.reportObserved();

    return this._data.keys();
  }

  values(): IterableIterator<T> {
    this.reportObserved();

    return this._data.values();
  }

  [Symbol.unscopables](): {
    copyWithin: boolean;
    entries: boolean;
    fill: boolean;
    find: boolean;
    findIndex: boolean;
    keys: boolean;
    values: boolean;
    observableId: boolean;
  } {
    return {
      copyWithin: false,
      entries: false,
      fill: false,
      find: false,
      findIndex: false,
      keys: false,
      values: false,
      observableId: false,
    };
  }

  includes(searchElement: T, fromIndex?: number | undefined): boolean {
    this.reportObserved();

    return this._data.includes(searchElement, fromIndex);
  }

  flatMap<U, This = undefined>(
    callback: (
      this: This,
      value: T,
      index: number,
      array: T[],
    ) => U | ReadonlyArray<U>,
    thisArg?: This | undefined,
  ): U[] {
    this.reportObserved();

    return this._data.flatMap(callback, thisArg);
  }

  flat<U>(this: U[][][][][][][][], depth: 7): U[];
  flat<U>(this: U[][][][][][][], depth: 6): U[];
  flat<U>(this: U[][][][][][], depth: 5): U[];
  flat<U>(this: U[][][][][], depth: 4): U[];
  flat<U>(this: U[][][][], depth: 3): U[];
  flat<U>(this: U[][][], depth: 2): U[];
  flat<U>(this: U[][], depth?: 1 | undefined): U[];
  flat<U>(this: U[], depth: 0): U[];
  flat<U>(depth?: number | undefined): any[];
  flat(depth?: any): any {
    this.reportObserved();

    return this._data.flat(depth);
  }

  private reportObserved(): void {
    dependencyManager.collect(this.observableId);
  }

  private trigger(): void {
    dependencyManager.trigger(this.observableId);
  }
}

// TODO: to extend array object's own non-array-item property
export function createObservableArray<T, U>(
  arrayLike: ArrayLike<T>,
  mapfn: (v: U, k: number) => T,
  thisArg?: any,
): ObservableArray<T, U>;
export function createObservableArray<T>(
  arrayLike: ArrayLike<T>,
): ObservableArray<T>;
export function createObservableArray<T>(...items: T[]): ObservableArray<T>;
export function createObservableArray(...args: any[]): any {
  let array = new ObservableArray(...args);

  let handler: ProxyHandler<typeof array> = {
    set(target: any, key, value) {
      if (typeof value === 'function') {
        target[key] = wrapObservableMethod(value, array.observableId);
      } else {
        target[key] = convertToObservable(value);
      }

      dependencyManager.trigger(array.observableId);

      return true;
    },
  };

  return new Proxy(array, handler);
}
