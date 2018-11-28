interface MaxIdStore {
  observable: number;
  computed: number;
}

export class IdManager {
  private maxIdStore: MaxIdStore = {
    observable: 0,
    computed: 0,
  };

  generate<T extends keyof MaxIdStore>(type: T): string {
    return `${type}-${++this.maxIdStore[type]}`;
  }
}

export const idManager = new IdManager();
