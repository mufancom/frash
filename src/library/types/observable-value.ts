import {dependencyManager, idManager} from '../core';

export class ObservableValue<T = any> {
  readonly id = idManager.generate('observable');

  private value: T;

  constructor(target: T) {
    this.value = target;
  }

  get(): T {
    dependencyManager.collect(this.id);
    return this.value;
  }

  set(value: T): void {
    this.value = value;

    this.trigger();
  }

  trigger(): void {
    dependencyManager.trigger(this.id);
  }
}
