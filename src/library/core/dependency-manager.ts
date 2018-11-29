export interface ObservableInfo {
  target: any | undefined;
  observers: Function[];
}

class DependencyManager {
  private observableMap = new Map<string, ObservableInfo>();

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

  collect(observableId: string): void {
    if (!this.currentObserver) {
      return;
    }

    let info = this.observableMap.get(observableId);

    if (info) {
      info.target = this.currentTarget;
      info.observers.push(this.currentObserver);
    } else {
      this.observableMap.set(observableId, {
        target: this.currentTarget,
        observers: [this.currentObserver],
      });
    }
  }

  endCollect(): void {
    this.observerStack.pop();
    this.targetStack.pop();
  }
}

export const dependencyManager = new DependencyManager();