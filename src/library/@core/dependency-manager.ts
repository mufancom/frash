export interface ObservableInfo {
  target: any | undefined;
  observers: Function[];
}

export class DependencyManager {
  private observableMap = new Map<string, ObservableInfo>();

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

  trigger(observerId: string): void {
    let info = this.observableMap.get(observerId);

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

  collect(observerId: string): void {
    if (this.nowObserver) {
      this.addNowObserver(observerId);
    }
  }

  endCollect(): void {
    this.observerStack.pop();
    this.targetStack.pop();
  }

  private addNowObserver(observerId: string): void {
    if (!this.nowObserver) {
      return;
    }

    let info = this.observableMap.get(observerId);

    if (info) {
      info.target = this.nowTarget;
      info.observers.push(this.nowObserver);
    } else {
      this.observableMap.set(observerId, {
        target: this.nowTarget,
        observers: [this.nowObserver],
      });
    }
  }
}

export const dependencyManager = new DependencyManager();
