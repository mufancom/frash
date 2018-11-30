export function propertyHasGetterOrSetter(target: any, key: string): boolean {
  let descriptor = Object.getOwnPropertyDescriptor(target, key) as any;

  return !(!descriptor.get && !descriptor.set);
}

export function getGetter<T = any>(
  target: any,
  key: any,
): (() => T) | undefined {
  let descriptor = Object.getOwnPropertyDescriptor(target, key) as any;

  return descriptor.get;
}

export function getSetter<T = any>(
  target: any,
  key: any,
): ((value: T) => void) | undefined {
  let descriptor = Object.getOwnPropertyDescriptor(target, key) as any;

  return descriptor.set;
}
