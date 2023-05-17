any 타입은 진화한다.  
즉 맨 처음 타입은 any였을지라도, 실행흐름에 따라 다른 타입으로 점점 구체화되어간다.  
(단 명시적으로 타입을 any로 지정한 경우에는 예외)

아래 코드에서 out은 any 타입의 []로 초기화되었지만, 마지막 return 직전에는  
number[]로 타입이 구체화되며 진화한 것을 볼 수 있다.

```typescript
function range(start: number, limit: number) {
  const out = []; // any[]
  for (let i = start; i < limit; i++) {
    out.push(i);
  }
  return out; // number[]
}
```

```typescript
const result = []; // any[]
result.push("a");
result; // string[]
result.push(1);
result; // (string | number)[]
```

타입은 분기에 따라서 진화가 다르게 나타날 수 있다.

```typescript
let val; // any
if (Math.random() < 0.5) {
  val = /hello/;
  val; // RegExp
} else {
  val = 12;
  val; // number
}
val; // number | RegExp
```

하지만 명시적으로 타입을 any로 선언한 경우에는 진화가 발생하지 않는다.

```typescript
let val: any; // any
if (Math.random() < 0.5) {
  val = /hello/;
  val; // any
} else {
  val = 12;
  val; // any
}
val; // any
```

```typescript

```
