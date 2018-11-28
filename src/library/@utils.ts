export class DoubleKeyMap<K = any, S = any, V = any> {
  private outerMap = new Map<K, Map<S, V>>();

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

  getSubMap(key: K): Map<S, V> | undefined {
    return this.outerMap.get(key);
  }
}
