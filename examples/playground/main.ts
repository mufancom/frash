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
    return this.name + JSON.stringify(this.test.get('3'));
  }
}

let hello = new Hello();

console.log(hello.name2);

hello.name = '2';

console.log(hello.name2);

hello.test.set('3', true);

console.log(hello.name2);

let obj = observable({a: 1});

let value = '1-';

let com = computed(() => {
  return value + obj.a;
});

console.log(com.get());

value = '2-';

console.log(com.get());

obj.a = 2;

console.log(com.get());
