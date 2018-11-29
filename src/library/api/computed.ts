import {Computed} from '../core';
import {DoubleKeyMap} from '../utils';

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
