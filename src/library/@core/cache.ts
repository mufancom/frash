class Cache {
  private dataMap = new Map<string>();

  get(key: string): any | undefined {
    return this.dataMap.get(key);
  }

  set(key: string, value: any): void {
    this.dataMap.set(key, value);
  }

  delete(key: string): any | undefined {
    let oldValue = this.dataMap.get(key);

    this.dataMap.delete(key);

    return oldValue;
  }
}

export const cache = new Cache();
