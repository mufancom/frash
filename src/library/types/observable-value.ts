import {dependencyManager, idManager} from '../core';

export class ObservableValue<T = any> {
  readonly observableId = idManager.generate('observable');

  private value: T;

  constructor(target: T) {
    Object.defineProperty(this, 'observableId', {
      enumerable: false,
    });

    this.value = target;
  }

  get(): T {
    dependencyManager.collect(this.observableId);
    return this.value;
  }

  set(value: T): void {
    this.value = value;

    this.trigger();
  }

  trigger(): void {
    dependencyManager.trigger(this.observableId);
  }
}
