import {computed, observable} from '../../bld/library';

/**
 * ts-node --transpileOnly --project examples/playground/tsconfig.json examples/playground/main.ts
 */

class Hello {
  test: string = 'fawf';

  @computed
  get name2(): string {
    return 'sd' + this.test;
  }
}

let hello = new Hello();

console.log(hello.name2);

// console.log(hello);
