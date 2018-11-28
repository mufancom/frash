import {ObservableId} from './id-manager';

export interface ObservableInfo {
  target: any | undefined;
  observers: Function[];
}

class DependencyManager {
  private observableMap = new Map<ObservableId, ObservableInfo>();

  private observerStack: Function[] = [];

  private targetStack: any[] = [];

  private get nowObserver(): Function | undefined {
    if (!this.observerStack.length) {
      return undefined;
    }

    return this.observerStack[this.observerStack.length - 1];
  }

  private get nowTarget(): any | undefined {
    if (!this.targetStack.length) {
      return undefined;
    }

    return this.targetStack[this.observerStack.length - 1];
  }

  trigger(observableId: ObservableId): void {
    let info = this.observableMap.get(observableId);

    if (!info) {
      return;
    }

    let {target, observers} = info;

    for (let observer of observers) {
      observer.call(target || this);
    }
  }

  beginCollect(observer: Function, target: any): void {
    this.observerStack.push(observer);
    this.targetStack.push(target);
  }

  collect(observableId: ObservableId): void {
    if (!this.nowObserver) {
      return;
    }

    let info = this.observableMap.get(observableId);

    if (info) {
      info.target = this.nowTarget;
      info.observers.push(this.nowObserver);
    } else {
      this.observableMap.set(observableId, {
        target: this.nowTarget,
        observers: [this.nowObserver],
      });
    }
  }

  endCollect(): void {
    this.observerStack.pop();
    this.targetStack.pop();
  }
}

export const dependencyManager = new DependencyManager();
