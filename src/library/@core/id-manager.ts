export type ObservableId = number;

interface MaxIdStore {
  observable: ObservableId;
}

export class IdManager {
  private maxIdStore: MaxIdStore = {
    observable: 0,
  };

  generate<T extends keyof MaxIdStore>(type: T): MaxIdStore[T] {
    return this.maxIdStore[type];
  }
}

export const idManager = new IdManager();
