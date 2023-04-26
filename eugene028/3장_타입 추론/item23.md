# item23

# 객체를 생성할 때는 한꺼번에 생성하라
타입스크립트에서 타입은 일반적으로 동적으로 변경되지 않는다. 그래서 객체를 생성할 때에는 **여러 속성을 포함하여 한꺼번에 생성해야, 타입 추론에 유리하다.**
```ts
const pt = {};
pt.x = 3;
pt.y = 4;
```
이렇게 작성하게 되면 타입스크립트의 할당문에는 오류가 발생하게 된다. 왜냐하면 `pt` 타입은 `{}`값을 기준으로 타입을 추론하기 때문이다.
이러한 문제는 객체를 한번에 정의해야 해결할 수 있다. 
만약 객체를 반드시 제각각 나누어 만들어야겠다면, **타입 단언문**을 이용해야 한다.
```ts
const pt = {} as Point;
pt.x = 3;
pt.y = 4;
```
## 작은 객체를 조합하여 큰 객체를 만들 때는?
```ts
const pt = { x: 3, y: 4 }
const id = { name: 'Pythagoras' }
const namePoint = { ...pt, ...id };
```
객체 전개 연산자인 `...`을 사용하면 큰 객체를 한꺼번에 만들 수 있다.

## 조건부 속성을 추가하고 싶다면?
```ts
declare let hasMiddle: boolean;
const firstLast = {first: 'Harry', last: 'Truman'};
const president = {...firstLast, ...(hasMiddle ? {middle: 'S'} : {})};
```
편집기에서 president에 마우스를 올려보자.
![](https://velog.velcdn.com/images/gene028/post/28e8da34-998e-43bd-b300-1a7927674687/image.png)

그럼 이렇게 **선택적 속성**으로 표기된다. 
그런데 전개 연산자로 두 개 이상의 속성을 추가한다면?
```ts
declare let hasDates: boolean;
const nameTitle = { name: 'Khufu', title: 'Pharaoh'};
const pharaoh = {
  ...nameTitle,
  ...(hasDates? {start: -2589, end: -2566} : {})
};
```
이 경우에는 `start`와 `end`가 항상 함께 정의된다.  그리고 타입에서 각각의 속성을 읽어올 수가 없게 된다. 이럴 때에는 선택적 필드를 이용하여 헬퍼 함수로 원하는 대로 표현해볼 수 있겠다.
```ts
function addOptional<T extends object, U extends object>( a: T, b: U | null ): T & Partial<U> {
  return {...a, ...b};
}
const pharaoh = addOptional(
  nameTitle,
  hasDates ? {start: -2589, end: -2566} : null
);

```
