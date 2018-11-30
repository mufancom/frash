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
