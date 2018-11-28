import {computed, observable} from '../../bld/library';

/**
 * ts-node --transpileOnly --project examples/playground/tsconfig.json examples/playground/main.ts
 */

class Hello {
  @observable
  test = new Map();
  name: string = '1';

  @computed
  get name2(): string {
    return this.name + JSON.stringify(this.test.keys());
  }
}

let hello = new Hello();

console.log(hello.name2);

hello.name = '2';

console.log(hello.name2);

hello.test.set('3', true);

console.log(hello.name2);
