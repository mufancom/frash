import {DoubleKeyMap} from '../utils';

class DependencyManager {
  private observableMap = new DoubleKeyMap<string, object, Function[]>();

  private observerStack: Function[] = [];

  private targetStack: any[] = [];

  private get currentObserver(): Function | undefined {
    if (!this.observerStack.length) {
      return undefined;
    }

    return this.observerStack[this.observerStack.length - 1];
  }

  private get currentTarget(): any | undefined {
    if (!this.targetStack.length) {
      return undefined;
    }

    return this.targetStack[this.observerStack.length - 1];
  }

  trigger(observableId: string): void {
    let info = this.observableMap.getSubMap(observableId);

    if (!info) {
      return;
    }

    for (let [target, observers] of info) {
      for (let observer of observers) {
        observer.call(target || this);
      }
    }
  }

  beginCollect(observer: Function, target?: any): void {
    this.observerStack.push(observer);
    this.targetStack.push(target);
  }

  collect(observableId: string): void {
    if (!this.currentObserver) {
      return;
    }

    let observers = this.observableMap.get(observableId, this.currentTarget);

    if (observers) {
      observers.push(this.currentObserver);
    } else {
      this.observableMap.set(observableId, this.currentTarget, [
        this.currentObserver,
      ]);
    }
  }

  endCollect(): void {
    this.observerStack.pop();
    this.targetStack.pop();
  }
}

export const dependencyManager = new DependencyManager();
