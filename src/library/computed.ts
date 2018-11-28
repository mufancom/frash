import {dependencyManager, idManager} from './@core';

export type Getter<T> = () => T;

export class Computed<T> {
  private id = idManager.generate('computed');

  private hasBindAutoRecompute = false;

  private value!: T;

  constructor(private target: object, private getter: Getter<T>) {}

  fillInTarget(target: object): void {
    this.target = target;
  }

  get(): T {
    this.bindAutoRecompute();

    dependencyManager.collect(this.id);

    return this.value;
  }

  private recompute(): void {
    this.value = this.getter.call(this.target);

    dependencyManager.trigger(this.id);
  }

  private bindAutoRecompute(): void {
    if (this.hasBindAutoRecompute) {
      return;
    }

    this.hasBindAutoRecompute = true;

    dependencyManager.beginCollect(this.recompute, this);
    this.recompute();
    dependencyManager.endCollect();
  }
}
