# 타입 좁히기

타입이 서로 혼재되어 있는 경우가 존재한다.  
(주로 특정 타입과 undefined, 혹은 null이 함께 존재하는 경우가 대표적)

이런 상황일 때 조건문을 통해서 타입을 서로 분리해낼 수 있다.  
하지만 타입 분리가 잘 되지 않는 경우가 발생할 수 있는데, 대표적인 경우는 아래와 같다.

```typescript
const foo = (x?: string | number | null) => {
  if (!x) {
    // x
  }
};
```

의도상으로는 매개변수로 x가 존재하지 않거나, null일 때 조건문을 통해 따로 처리를 하는 것으로 보인다.  
하지만 조건문 내부의 x는 undefined, null 이외에도 string과 number가 그대로 올 수 있는데 "", 0과 같은 falsy한 값들은 조건문의 조건을 통과하기 때문이다.

또한 함수의 리턴 값에 대하여 타입을 좁힐 수도 있다. (타입 가드)  
이를 통해 isString 함수의 호출 범위에 해당하는 영역에 대해서는 매개변수 target 값이 특정 타입으로 간주되어, 자동완성 기능을 이용할 수 있다.

```typescript
const isString = (test: any): test is string => {
  return typeof test === "string";
};

const text = "abc";

const foo = (target: any) => {
  if (isString(target)) {
    console.log(target.length);
  }
};

foo(text);
```
