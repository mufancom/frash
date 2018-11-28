import {computed, observable} from '../../bld/library';

/**
 * ts-node --transpileOnly --project examples/playground/tsconfig.json examples/playground/main.ts
 */

class Hello {
  @test
  test: string = 'fawf';

  name: string = 'awd';

  get name2(): string {
    return 'sd' + this.test;
  }
}

let hello = new Hello();
hello.name = 'hadhawd';

console.log(hello.test);

function test(target: any, key: string): any {
  Reflect.defineProperty(target, key, {
    get: function() {
      console.log(this);

      return 'dadw';
    },
    set: function(value) {
      return true;
    },
  });
}
