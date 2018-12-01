import {
  autorun,
  computed,
  extendObservable,
  isObservable,
  observable,
} from '../bld/library';

test('argumentless observable', () => {
  let box = observable.box();

  expect(isObservable(box)).toBe(true);
  expect(box.get()).toBe(undefined);
});

test('basic', () => {
  let x = observable.box(3);

  expect(x.get()).toBe(3);

  x.set(5);

  expect(x.get()).toBe(5);
});

test('basic with computed', () => {
  let x = observable.box(3);

  let z = computed(() => {
    return x.get() * 2;
  });

  let y = computed(() => {
    return x.get() * 3;
  });

  expect(z.get()).toBe(6);
  expect(y.get()).toBe(9);

  x.set(5);

  expect(z.get()).toBe(10);
  expect(y.get()).toBe(15);
});

test('computed with asStructure modifier', () => {
  let x1 = observable.box(3);
  let x2 = observable.box(5);

  let y = computed(() => {
    return {sum: x1.get() + x2.get()};
  });

  expect(y.get().sum).toBe(8);

  x1.set(4);

  expect(y.get().sum).toBe(9);

  x1.set(5);
  x2.set(4);

  expect(y.get().sum).toBe(9);
});

test('computed as object property', () => {
  let vat = observable.box(0.2);

  let order = {} as any;

  order.price = observable.box(10);

  order.priceWithVat = computed(() => {
    return order.price.get() * (1 + vat.get());
  });

  order.price.set(20);

  expect(order.priceWithVat.get()).toBe(24);

  order.price.set(10);

  expect(order.priceWithVat.get()).toBe(12);
});

test('batch', () => {
  let a = observable.box(2);
  let b = observable.box(3);

  let c = computed(() => {
    return a.get() * b.get();
  });

  let d = computed(() => {
    return c.get() * b.get();
  });

  expect(c.get()).toBe(6);
  expect(d.get()).toBe(18);

  a.set(4);

  expect(c.get()).toBe(12);
  expect(d.get()).toBe(36);

  b.set(5);

  expect(c.get()).toBe(20);
  expect(d.get()).toBe(100);
});

test('scope', () => {
  let vat = observable.box(0.2);

  class Order {
    price = observable.box(20);
    amount = observable.box(2);
    total = computed(() => {
      return (1 + vat.get()) * this.price.get() * this.amount.get();
    });
  }

  let order = new Order();

  expect(order.total.get()).toBe(48);

  order.price.set(10);
  order.amount.set(3);
  expect(order.total.get()).toBe(36);
});

test('props1', () => {
  let vat = observable.box(0.2);

  class Order {
    constructor() {
      extendObservable(this, {
        price: 20,
        amount: 2,
        get total() {
          return (1 + vat.get()) * this.price * this.amount;
          // tslint:disable-next-line
        },
      });
    }
  }

  let order = new Order() as any;

  expect(order.total).toBe(48);

  order.price = 10;
  order.amount = 3;

  expect(order.total).toBe(36);

  let totals: number[] = [];

  let dispose = autorun(() => {
    totals.push(order.total);
  });

  order.amount = 4;

  dispose();

  order.amount = 5;

  expect(totals).toEqual([36, 48]);
});

test('props2', () => {
  let vat = observable.box(0.2);

  class Order {
    constructor() {
      extendObservable(this, {
        price: 20,
        amount: 2,
        get total() {
          return (1 + vat.get()) * this.price * this.amount;
          // tslint:disable-next-line
        },
      });
    }
  }

  let order = new Order() as any;

  expect(order.total).toBe(48);

  order.price = 10;
  order.amount = 3;

  expect(order.total).toBe(36);
});

test('props4', () => {
  class Bzz {
    constructor() {
      extendObservable(this, {
        fluff: [1, 2],
        get sum() {
          return this.fluff.reduce((a: any, b: any) => a + b, 0);
          // tslint:disable-next-line
        },
      });
    }
  }

  let x = new Bzz() as any;

  expect(x.sum).toBe(3);

  x.fluff.push(3);

  expect(x.sum).toBe(6);

  x.fluff = [5, 6];

  expect(x.sum).toBe(11);

  x.fluff.push(2);

  expect(x.sum).toBe(13);
});

test('object enumerable props', () => {
  let x = observable({
    a: 3,
    get b() {
      return 2 * this.a;
      // tslint:disable-next-line
    },
  });

  extendObservable(x, {c: 4});

  let keys: string[] = [];

  for (let key in x) {
    keys.push(key);
  }

  expect(keys).toEqual(['a', 'c']);
});

test('observer property', () => {
  let sb: any[] = [];
  let mb: any[] = [];

  class Wrapper {
    constructor(chocolateBar: any) {
      extendObservable(this, {
        chocolateBar,
        get calories() {
          return this.chocolateBar.calories;
          // tslint:disable-next-line
        },
      });
    }
  }

  let snickers = observable<any>({
    // tslint:disable-next-line
    calories: null,
  });

  let mars = observable<any>({
    calories: undefined,
  });

  let wrappedSnickers = new Wrapper(snickers) as any;
  let wrappedMars = new Wrapper(mars) as any;

  let disposeSnickers = autorun(() => {
    sb.push(wrappedSnickers.calories);
  });

  let disposeMars = autorun(() => {
    mb.push(wrappedMars.calories);
  });

  snickers.calories = 10;
  mars.calories = 15;

  disposeSnickers();
  disposeMars();

  snickers.calories = 5;
  mars.calories = 7;

  // tslint:disable-next-line
  expect(sb).toEqual([null, 10]);
  expect(mb).toEqual([undefined, 15]);
});

test('change count optimization', () => {
  let bCalcs = 0;
  let cCalcs = 0;

  let a = observable.box(3);

  let b = computed(() => {
    bCalcs += 1;
    return 4 + a.get() - a.get();
  });

  let c = computed(() => {
    cCalcs += 1;
    return b.get();
  });

  expect(b.get()).toBe(4);
  expect(c.get()).toBe(4);
  expect(bCalcs).toBe(1);
  expect(cCalcs).toBe(1);

  a.set(5);

  expect(b.get()).toBe(4);
  expect(c.get()).toBe(4);
  expect(bCalcs).toBe(2);
  expect(cCalcs).toBe(1);
});

test('observables removed', () => {
  let calcs = 0;

  let a = observable.box(1);
  let b = observable.box(2);

  let c = computed(() => {
    calcs++;

    if (a.get() === 1) {
      return b.get() * a.get() * b.get();
    }

    return 3;
  });

  expect(calcs).toBe(0);
  expect(c.get()).toBe(4);
  expect(calcs).toBe(1);

  a.set(2);

  expect(c.get()).toBe(3);
  expect(calcs).toBe(2);

  b.set(3); // should not retrigger calc
  expect(c.get()).toBe(3);
  expect(calcs).toBe(2);

  a.set(1);
  expect(c.get()).toBe(9);
  expect(calcs).toBe(3);
});

// TODO: lazy evaluation
test('instant evaluation', () => {
  let bCalcs = 0;
  let cCalcs = 0;

  let a = observable.box(1);

  let b = computed(() => {
    bCalcs += 1;

    return a.get() + 1;
  });

  let c = computed(() => {
    cCalcs += 1;

    return b.get() + 1;
  });

  expect(bCalcs).toBe(0);
  expect(cCalcs).toBe(0);
  expect(c.get()).toBe(3);
  expect(bCalcs).toBe(1);
  expect(cCalcs).toBe(1);

  expect(c.get()).toBe(3);
  expect(bCalcs).toBe(1);
  expect(cCalcs).toBe(1);

  a.set(2);

  expect(bCalcs).toBe(2);
  expect(cCalcs).toBe(2);

  expect(c.get()).toBe(4);
  expect(bCalcs).toBe(2);
  expect(cCalcs).toBe(2);
});

test('multiple view dependencies', () => {
  let bCalcs = 0;
  let dCalcs = 0;

  let a = observable.box(1);

  let b = computed(() => {
    bCalcs++;

    return 2 * a.get();
  });

  let c = observable.box(2);

  let d = computed(() => {
    dCalcs++;

    return 3 * c.get();
  });

  let zwitch = true;

  let buffer: number[] = [];

  let fCalcs = 0;

  let dis = autorun(() => {
    fCalcs++;

    if (zwitch) {
      buffer.push(b.get() + d.get());
    } else {
      buffer.push(d.get() + b.get());
    }
  });

  zwitch = false;

  c.set(3);

  expect(bCalcs).toBe(1);
  expect(dCalcs).toBe(2);
  expect(fCalcs).toBe(2);
  expect(buffer).toEqual([8, 11]);

  c.set(4);

  expect(bCalcs).toBe(1);
  expect(dCalcs).toBe(3);
  expect(fCalcs).toBe(3);
  expect(buffer).toEqual([8, 11, 14]);

  dis();

  c.set(5);

  expect(bCalcs).toBe(1);
  expect(dCalcs).toBe(4); // Instant evaluation
  expect(fCalcs).toBe(3);
  expect(buffer).toEqual([8, 11, 14]);
});
