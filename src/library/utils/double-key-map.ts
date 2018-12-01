export class DoubleKeyMap<K = any, S = any, V = any> {
  private outerMap = new Map<K, Map<S, V>>();

  [Symbol.iterator](): IterableIterator<[K, Map<S, V>]> {
    return this.entries();
  }

  entries(): IterableIterator<[K, Map<S, V>]> {
    return this.outerMap.entries();
  }

  keys(): IterableIterator<K> {
    return this.outerMap.keys();
  }

  values(): IterableIterator<Map<S, V>> {
    return this.outerMap.values();
  }

  set(key: K, subKey: S, value: V): this {
    let subMap = this.outerMap.get(key);

    if (!subMap) {
      subMap = new Map<S, V>();
      this.outerMap.set(key, subMap);
    }

    subMap.set(subKey, value);

    return this;
  }

  get(key: K, subKey: S): V | undefined {
    let subMap = this.outerMap.get(key);

    if (!subMap) {
      return undefined;
    }

    return subMap.get(subKey);
  }

  has(key: K, subKey: S): boolean {
    let subMap = this.outerMap.get(key);

    if (!subMap) {
      return false;
    }

    return subMap.has(subKey);
  }

  clear(): void {
    this.outerMap.clear();
  }

  delete(key: K, subKey: S): boolean {
    let subMap = this.outerMap.get(key);

    if (!subMap) {
      return false;
    }

    return subMap.delete(subKey);
  }

  deleteBySubKey(subKey: S): void {
    let keys = this.outerMap.keys();

    for (let key of keys) {
      let subMap = this.outerMap.get(key);

      if (subMap && subMap.has(subKey)) {
        subMap.set(subKey, undefined as any);
        // subMap.delete(subKey);
      }
    }
  }

  getSubMap(key: K): Map<S, V> | undefined {
    return this.outerMap.get(key);
  }
}
