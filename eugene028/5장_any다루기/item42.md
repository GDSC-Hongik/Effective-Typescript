# item42
만약 내가 함수의 반환값을 지정해야 하는데, 잘 모를 때, 아래와 같이 함수를 정의할 수 있다.
```ts
function parseYAML(yaml: string): any {
  //..
}
```
반환 타입으로 `any`를 사용하는 것은 좋지 않다. 그 이유는 `any`를 남발하다 보면 사용하는 곳마다 타입 에러를 발생하게 될 수 있고, 나도 모르게 `undefined`가 들어가지만 오류가 발생하지 않아 의도하지 않은 동작을 확인할 수도 있다.
이는 any의 강력한 특성 때문인데, any는 아래와 같은 특징이 있다 (..)
- 어떠한 타입이든 any에 할당이 가능하다.
- any는 어떠한 타입으로도 할당 가능하다.

헉.. 집합 단위로 타입을 생각해오다 보면 any는 도대체 어떤 집합으로 타입을 분류해야 하는지 감도 안잡히는 생태계 교란종(?)과 같이 느껴진다. 그렇기 때문에 any를 사용하게 되면 파괴적인 힘을 자랑하기 때문에, 타입 체커를 이용하기 어려워진다. 
그렇기 때문에 `unknown`을 사용하게 되는 것인데, `unknown`이 어떤 특성을 가지고 있는지 확인해 보아야지 이에 대한 사용처를 정리해 볼 수 있을 것이다.
- 어떠한 타입이든 unknown에 할당이 가능하다.
- unknown은 오직 unknown과 any에만 할당이 가능하다.
- unknown 타입인 채로 값을 사용하면 오류가 발생한다.

자 이제 unknown을 어떨 때 사용하는지 정리해보자.

## 1. 개발자가 적절한 타입으로 변환하도록 강제하기
```ts
const book = safeParseYAML(`
	name: Villette
	author: Charlotte Bronte
`) as Book;
alert(book.title); //오류
book('read') //오류
```
함수의 반환 값으로 `unknown`을 지정하였다. 당연히 오류가 발생하기 때문에 개발자가 직접 `Book`이라는 타입으로 단언을 해 주어야 한다. 
변수를 선언할 때에도 마찬가지이다.
```ts
interface Feature { 
  id?: string | number;
  geometry: Geometry;
  properties: unknown;
}
```
`properties`는 나중에 `unknown`에서 원하는 타입으로 꼭 변환해주어야겠지! 

## 2. 리팩토링에 유용
```ts
declare const foo: Foo;
let barAny = foo as any as Bar;
let barUnk = foo as unknown as Bar;
```
`barAny`와 `barUnk`는 기능적으로 동일하지만, 나중에 두 개의 단언문을 분리해야 하는 리팩토링을 해야 한다면 `unknown`을 사용하는 형태가 더욱 안전하게 사용될 수 있다. 그 이유는 `unknown`을 사용하게 되면 분리되는 경우 즉시 오류를 발생시키기 때문이다.

## 3. unknown과 닮은꼴
unknown을 사용하기 전에는 `object`나 `{}`를 빈번하게 사용하는 경우가 많았다. 이를 구분해보자.
- {} 타입은 null과 undefined를 제외한 모든 값을 포함한다.
- object 타입은 모든 비기본형 타입으로 되어 있다. 