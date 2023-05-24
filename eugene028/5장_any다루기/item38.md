# item38

## any의 사용 범위를 최소한으로 줄이자.
## 함수에서의 any 사용
```ts
function f1() {
  const x: any = expressionReturningFoo();
  processBar(x);
}
```
```ts
function f2() {
  const x = expressionReturningFoo();
  processBar(x as any);
```
`f1`, `f2` 두 함수 중에서 더욱 `any`를 현명하게 사용한 것은 어떤 것일까? 바로 `f2` 함수이다. 그 이유는 아래와 같다.
- `any` 타입이 `processBar` 함수에 매개변수에만 사용된 표현식이다.
- `f` 함수의 반환에서 `x` 가 반한되었을 때 `any`가 확장되는 문제점을 최소화할 수 있다.

이렇게 함수가 반환될 때, 되도록 함수 반환 타입은 추론할 수 있는 경우에도 반환 타입을 명확하게 명시하는 것이 좋다. `any`가 사용될 수 있는 여지를 최소한으로 하자는 것이다.

## 객체에서의 any사용
프로퍼티 `c`에 사용되는 것에 대한 타입을 잘 알지 못해 아래와 같이 객체를 작성했다고 가정해보자.
```ts
const config: Config = {
  a: 1,
  b: 2,
  c: {
    key: value
  }
} as any;
```
객체 전체를 `any`로 단언하게 되면 다른 속성들도 타입 체크가 되지 않아서 피해가 막심해진다. 그러므로 잘 모르는 것만 딱 체크해서 타입 체크를 해보자.
```ts
const config: Config = {
  a: 1,
  b: 2, 
  c: {
    key: value as any
  }
}
```