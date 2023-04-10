# 타입 좁히기

```ts
const data: number | null = 0;

if (data) {
  // data는 number 타입으로 추론됨
}

// ------------------------------

let query: string | RegExp;

if (query instanceof RegExp) {
  // query는 RegExp 타입으로 추론됨
}

if (typeof query === "string") {
  // query는 string 타입으로 추론됨
}

// ------------------------------

type A = { a: number };
type B = { b: number };

let ab: A | B;

if ("a" in ab) {
  // ab는 A 타입으로 추론됨
} else {
  // ab는 B 타입으로 추론됨
}

// ------------------------------

let arr: string | string[];

if (Array.isArray(arr)) {
  // arr는 string[] 타입으로 추론
}

// ------------------------------

const x: number | string | null = null;

if (!x) {
  // ""나 0 등의 falsy 값도 false 처리가 되기 때문에
  // x는 string | number 타입으로 추론됨
}

// ------------------------------

type A = { type: "A" };
type B = { type: "B" };

let tagged_union: A | B;

if (tagged_union.type === "A") {
  // tagged_union은 A 타입으로 추론됨
}

// ------------------------------

// type guard 정의
function isDefined<T>(x: T | null): x is T {
  return x !== null;
}

let sparse_arr: (number | null)[];

// filtered_arr는 number[] 타입으로 추론됨
const filtered_arr = sparse_arr.filter(isDefined);
```
