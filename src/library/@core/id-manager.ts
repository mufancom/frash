export type ObservableId = number;
export type ComputedId = number;

interface MaxIdStore {
  observable: ObservableId;
  computed: ComputedId;
}

export class IdManager {
  private maxIdStore: MaxIdStore = {
    observable: 0,
    computed: 0,
  };

  generate<T extends keyof MaxIdStore>(type: T): MaxIdStore[T] {
    return ++this.maxIdStore[type];
  }
}

export const idManager = new IdManager();
