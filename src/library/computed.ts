export function computed(
  this: any,
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
): void {
  let {get} = descriptor;

  function getter(this: any): any {
    console.log(this);

    if (get) {
      return get.call(this);
    }

    return undefined;
  }

  descriptor.get = getter;
}
