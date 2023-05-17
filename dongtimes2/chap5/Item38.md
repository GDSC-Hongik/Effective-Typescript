불가피하게 any를 사용해야 될 경우 최대한 타입 사용 범위를 좁혀야 된다.  
또한 함수의 반환을 any로 하는 행위는 절대 삼가야 된다.

```typescript
function f1() {
  const x: any = expressionReturningFoo(); // 반환값 any 금지!
  processBar(x);
}
```

```typescript
// 반환값을 any로 지정하였을 때 발생할 수 있는 문제

function f1() {
  const x: any = expressionReturningFoo();
  processBar(x);
  return x;
}

function g() {
  const foo = f1(); // any타입
  foo.fooMethod(); // 따라서 이 부분의 타입체크 불가능
}
```

```typescript
function f2() {
  const x = expressionReturningFoo();
  processBar(x as any); // 올바른 사용법
}
```

마찬가지의 원리로 객체의 타입 역시 통째로 any로 지정하는 행위는 바람직하지 않다.

```typescript
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value,
  },
} as any; // 금지!
```

```typescript
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value as any, // 권장되는 방법
  },
};
```
