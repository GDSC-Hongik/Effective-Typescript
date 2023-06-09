# item16

## 인덱스 시그니처에 number 타입을 사용한다는 것
### 자바스크립트의 이상한 동작(?)
타입스크립트는 자바스크립트의 객체 모델을 이용하여 모델링하였기 때문에, 자바스크립트의 객체 모델링과 동작에 대하여 잘 알고 있어야 한다.
먼저, **배열**은 **객체**이다.
객체의 키는 보통 문자열로 표현된다. 그렇기 때문에 아래와 같은 현상이 일어난다.
- 복잡한 객체를 키로 사용하려고 하면, `toString`메서드가 호출되어 객체가 문자열로 변환된다.
- 숫자는 키로 사용할 수 없다.
- 문자열 키를 접근해도 배열의 요소에 접근할 수 있다.
- `Object.keys`을 이용하면 문자열 키가 출력된다.
### 타입스크립트에서는?
타입스크립트에서는 이러한 자바스크립트의 혼란을 줄이기 위해서 숫자 키를 허용하고, 문자열 키와는 다른 것으로 **인식**합니다.

사실, 타입스크립트에서 문자열 키를 따로 체크하는 과정이 있는 것은 아니고, **타입 체크** 시점에 인덱스에 대한 타입을 확인하는 과정에서 오류를 잡아낼 수 있는 것이다.
```ts
interface Array<T> {
  //...
  [n: number]: T;
}
```
```ts
const xs = [1, 2, 3];
const x0 = xs[0];
const x1 = xs['1']; //인덱스 식이 number형식이 아닙니다.
```
타입 정보는 런타임시 제거된다. 그래서 코드는 실제로 동작하지 않는 가상코드이지만, 타입 체커에서 오류를 잡아낼 수 있다는 것에 의의가 있다.

### Array.prototype.forEach
만약, 인덱스의 타입이 중요하다면, `number` 타입을 제공해주는 forEach를 이용하자!
그리고 루프 중간에 멈춰야 한다면 `for`루프를 사용할 수 있는데, 느리므로 자주 사용하지는 말자. 
