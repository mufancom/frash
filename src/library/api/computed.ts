import {Computed} from '../core';
import {DoubleKeyMap} from '../utils';

function computedDecorator<T extends object>(
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

export function computed<T>(fn: () => T): Computed<T>;
export function computed<T extends object>(
  target: T,
  name: string,
  descriptor: PropertyDescriptor,
): void;
export function computed(
  this: any,
  target: any,
  name?: string,
  descriptor?: PropertyDescriptor,
): any {
  if (!name && !descriptor) {
    return new Computed(this, target);
  } else if (name && descriptor) {
    computedDecorator(target, name, descriptor);
  } else {
    throw new Error(
      `Unexpected usage. \`computed\` should either be used as a getter decorator or a function wrapper.`,
    );
  }
}
