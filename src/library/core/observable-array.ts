import { dependencyManager } from './@dependency-manager';
import { idManager } from './@id-manager';
import { convertToObservable, makeObservable } from './observable';

export class ObservableArray<T> implements Array<T> {
  [n: number]: T;
  length: number;

  private id = idManager.generate('observable');

  private _data:  Array<T>;

  constructor<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any);
  constructor<T>(arrayLike: ArrayLike<T>)
  constructor<T>(...items: T[])
  constructor(...args: any[]){
    this._data = new Array(...args);

    for(let [index, value] of this._data.entries()){
      this._data[index] = convertToObservable(value);
    }

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

    throw new Error("Method not implemented.");
  }

  concat(...items: ConcatArray<T>[]): T[];
  concat(...items: (T | ConcatArray<T>)[]): T[];
  concat(...items?: any[]) {
    throw new Error("Method not implemented.");
  }

  join(separator?: string | undefined): string {
    throw new Error("Method not implemented.");
  }

  reverse(): T[] {
    throw new Error("Method not implemented.");
  }

  shift(): T | undefined {
    throw new Error("Method not implemented.");
  }

  slice(start?: number | undefined, end?: number | undefined): T[] {
    throw new Error("Method not implemented.");
  }

  sort(compareFn?: ((a: T, b: T) => number) | undefined): this {
    throw new Error("Method not implemented.");
  }

  splice(start: number, deleteCount?: number | undefined): T[];
  splice(start: number, deleteCount: number, ...items: T[]): T[];
  splice(start: any, deleteCount?: any, ...rest?: any[]) {
    throw new Error("Method not implemented.");
  }

  unshift(...items: T[]): number {
    throw new Error("Method not implemented.");
  }

  indexOf(searchElement: T, fromIndex?: number | undefined): number {
    throw new Error("Method not implemented.");
  }

  lastIndexOf(searchElement: T, fromIndex?: number | undefined): number {
    throw new Error("Method not implemented.");
  }

  every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean {
    throw new Error("Method not implemented.");
  }

  some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean {
    throw new Error("Method not implemented.");
  }

  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
    throw new Error("Method not implemented.");
  }

  map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
    throw new Error("Method not implemented.");
  }

  filter<S extends T>(callbackfn: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
  filter(callbackfn: (value: T, index: number, array: T[]) => , thisArg?: any): T[];
  filter(callbackfn: any, thisArg?: any) {
    throw new Error("Method not implemented.");
  }

  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
  reduce(callbackfn: any, initialValue?: any) {
    throw new Error("Method not implemented.");
  }

  reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
  reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
  reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
  reduceRight(callbackfn: any, initialValue?: any) {
    throw new Error("Method not implemented.");
  }

  find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
  find(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined;
  find(predicate: any, thisArg?: any) {
    throw new Error("Method not implemented.");
  }

  findIndex(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): number {
    throw new Error("Method not implemented.");
  }

  fill(value: T, start?: number | undefined, end?: number | undefined): this {
    throw new Error("Method not implemented.");
  }

  copyWithin(target: number, start: number, end?: number | undefined): this {
    throw new Error("Method not implemented.");
  }

  [Symbol.iterator](): IterableIterator<T> {
    throw new Error("Method not implemented.");
  }

  entries(): IterableIterator<[number, T]> {
    throw new Error("Method not implemented.");
  }

  keys(): IterableIterator<number> {
    throw new Error("Method not implemented.");
  }

  values(): IterableIterator<T> {
    throw new Error("Method not implemented.");
  }

  [Symbol.unscopables](): { copyWithin: boolean; entries: boolean; fill: boolean; find: boolean; findIndex: boolean; keys: boolean; values: boolean; } {
    throw new Error("Method not implemented.");
  }

  includes(searchElement: T, fromIndex?: number | undefined): boolean {
    throw new Error("Method not implemented.");
  }

  flatMap<U, This = undefined>(callback: (this: This, value: T, index: number, array: T[]) => U | ReadonlyArray<U>, thisArg?: This | undefined): U[] {
    throw new Error("Method not implemented.");
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
  flat(depth?: any) {
    throw new Error("Method not implemented.");
  }

  private reportObserved(): void {
    dependencyManager.collect(this.id);
  }

  private trigger(): void {
    dependencyManager.trigger(this.id);
  }
}
