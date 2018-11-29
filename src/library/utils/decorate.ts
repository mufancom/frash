export function decorate<T>(
  constructor: new (...args: any[]) => T,
  decorators: {
    [P in keyof T]?:
      | MethodDecorator
      | PropertyDecorator
      | MethodDecorator[]
      | PropertyDecorator[]
  },
): void;
export function decorate<T>(
  object: T,
  decorators: {
    [P in keyof T]?:
      | MethodDecorator
      | PropertyDecorator
      | MethodDecorator[]
      | PropertyDecorator[]
  },
): T;
export function decorate(thing: any, decorators: any): any {
  let target = typeof thing === 'function' ? thing.prototype : thing;

  for (let prop in decorators) {
    let propertyDecorators = decorators[prop];

    if (!Array.isArray(propertyDecorators)) {
      propertyDecorators = [propertyDecorators];
    }

    let descriptor = Object.getOwnPropertyDescriptor(target, prop);
    let newDescriptor = propertyDecorators.reduce(
      (accDescriptor: any, decorator: any) =>
        decorator(target, prop, accDescriptor),
      descriptor,
    );

    if (newDescriptor) {
      Object.defineProperty(target, prop, newDescriptor);
    }
  }

  return thing;
}
