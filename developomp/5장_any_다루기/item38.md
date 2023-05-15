# any 타입은 가능한 한 좁은 범위에서만 사용하기

any의 사용은 최대한 피하고, 사용할 때는 최대한 좁은 범위에서만 사용해야 한다. 특히 함수의
반환 타입으로 `any`를 사용하면 많은 의도치 않은 일이 발생한다.

## 함수에서

```ts
type Foo = { _brand: "foo" };
type Bar = { _brand: "bar" };

declare function returnFoo(): Foo;
declare function processBar(bar: Bar): void;

const x = returnFoo();
processBar(x); // 에러!
```

위 코드를 보자. `returnFoo` 함수는 `Foo` 타입의 객체를 반환하고, `processBar` 함수는
`Bar` 타입의 객체를 인자로 받는다. 만약 `processBar`에 정말로 `Foo` 타입의 객체를 전달하고
싶다면 다음 세 가지 방법을 사용할 수 있다.

```ts
// any로 선언. x는 any 타입.
const x: any = returnFoo();
processBar(x);

// any 단언문 사용. x는 Foo 타입.
const x = returnFoo();
processBar(x as any);

// 타입스크립트에서 오류를 무시. x는 Foo 타입.
const x = returnFoo();
// @ts-ignore
processBar(x);
```

## 객체에서

```ts
type Config = {
  a: number;
  b: number;
  c: { key: string };
};

const config1: Config = {
  a: 1,
  b: 2,
  c: {
    key: 123, //에러!
  },
};

// 에러는 사라졌으나 a와 b 속성의 타입 체크가 안 됨
const config2: Config = {
  a: true,
  b: "",
  c: {
    key: 123,
  },
} as any;

// 최선의 경우
const config3: Config = {
  a: 1,
  b: 2,
  c: {
    key: 123 as any,
  },
};
```
