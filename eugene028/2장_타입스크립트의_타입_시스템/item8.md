# item8: 타입 공간과 값 공간의 심벌 구분하기
타입스크립트의 심벌(symbol)은 타입 공간이나 값 공간 중의 한 곳에 존재한다.
그래서 이 둘의 위치를 혼동하게 되면 혼란을 초래할 수 있으므로 이 둘을 잘 구분하여 사용할 수 있어야 한다.

```ts
interface Cylinder {
  radius: number;
  height: number;
}
const Cylinder = (radius: number, height: number) => ({radius, height});
```
`interface` Cylinder는 **타입**으로 사용된다. `const Cylinder`는 **값**으로 쓰인다.
즉 정리하자면 Cylinder는 값으로도 쓰일 수 있고, 타입으로 쓰일 수도 있다는 것이다.
이런 점이 오류를 발생시킬 수 있다.
```ts
function calculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) {
    shape.radius
    	// ~~ '{}'형식에 'radius' 속성이 없습니다.
  }
}
```
`instanceof`는 자바스크립트의 런타임 연산자이고, 값에 대하여 연산을 진행하기 때문에 Cylinder가 값으로 (함수로) 참조되어 이런 에러가 발생하는 것이다.
심벌이 타입인지 값인지는 한눈에 봐서 잘 알 수 없으므로, 문맥을 살펴야 한다.
일반적으로, `type`이나 `interface` 다음에 오는 것은 **타입**, `const`나 `let` 선언에 쓰이는 것은 **값**으로 평가할 수 있다.
이 부분이 헷갈린다면 <a href= "https://www.typescriptlang.org/play?#code/PTAEHUFMBsGMHsC2lQBd5oBYoCoE8AHSAZVgCcBLA1UABWgEM8BzM+AVwDsATAGiwoBnUENANQAd0gAjQRVSQAUCEmYKsTKGYUAbpGF4OY0BoadYKdJMoL+gzAzIoz3UNEiPOofEVKVqAHSKymAAmkYI7NCuqGqcANag8ABmIjQUXrFOKBJMggBcISGgoAC0oACCbvCwDKgU8JkY7p7ehCTkVDQS2E6gnPCxGcwmZqDSTgzxxWWVoASMFmgYkAAeRJTInN3ymj4d-jSCeNsMq-wuoPaOltigAKoASgAywhK7SbGQZIIz5VWCFzSeCrZagNYbChbHaxUDcCjJZLfSDbExIAgUdxkUBIursJzCFJtXydajBBCcQQ0MwAUVWDEQC0gADVHBQGNJ3KAALygABEAAkYNAMOB4GRonzFBTBPB3AERcwABS0+mM9ysygc9wASmCKhwzQ8ZC8iHFzmB7BoXzcZmY7AYzEg-Fg0HUiQ58D0Ii8fLpDKZgj5SWxfPADlQAHJhAA5SASPlBFQAeS+ZHegmdWkgR1QjgUrmkeFATjNOmGWH0KAQiGhwkuNok4uiIgMHGxCyYrA4PCCJSAA">타입스크립트 플레이그라운드</a>를 사용하여 타입 심볼을 지울 수 있다. 이 사이트는 자바스크립트 표현으로 바꿔주기 때문이다.

## 타입과 값은 번갈아 나온다.
```ts
interface Person {
  first: string;
  last: string;
}
const p: Person = {first: 'Jane', last: 'Jacos' };
```
이렇게 함수와 타입이 번갈아 나올 수 있다.

## 타입과 값이 모두 가능한 경우
### class
`class`와 `enum`은 타입과 값 두가지가 모두 가능한 예약어이다.
```ts
class Cylinder { 
  radius= 1;
  height= 1;
}
function calculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) {
    shape //Cylinder 타입으로 판단됨.
    shape.radius
  }
}
```
클래스가 타입으로 쓰일 때는 **형태(속성, 메서드)**가 사용되는 반면, 값으로 쓰일 때는 **생성자**가 사용된다. 이 예시에서는 Cylinder가 타입으로 사용된 것이다.

### typeof

연산자 중에서도 타입에서 쓰일 때와 값으로 쓰일 때 다른 역할을 하는 기능이 있다.
대표적으로 `typeof`는 **타입의 관점**에서 값을 읽어 타입스크립트 타입을 반환한다. **값의 관점**으로는 자바스크립트 런타임의 **Typeof** 연산자로 작동한다. 이렇게 상황에 따라 다르게 동작할 수 있다.
```ts
const v = typeof Cylinder; //값이 "function"
type T = typeof Cylinder; //타입이 "typeof Cylinder"
```

### 타입의 속성을 얻으려면
속성 접근자인 []는 타입을 쓰일 때 동일하게 동작한다.

`obj['field']`와 `obj.field`는 값은 동일해 보일 수 있어도, 타입의 속성을 얻을 때는 반드시 **obj['field']**를 사용해야 한다.

## 에러 핸들링
타입스크립트 코드가 잘 동작하지 않는다면, **타입 공간과 값 공간을 혼동해서** 잘못 작성하였을 가능성이 크다. 구조 분해 할당을 이용하여 아래 코드를 바꾸어봤다고 하자.
```ts
function email (options: {person: Person, subject: string, body: string}) { //...}
을 바꾸어서
function email({person: Person, subject: string, body: string}) }
	//...
}
```
타입스크립트에서 구조 분해 할당을 하면 위의 코드는 아래와 같은 에러를 반환한다.
```
바인딩 요소 'Person'에 암시적으로 'any' 형식이 있습니다.
'string' 식별자가 중복되었습니다.
바인딩 요소 'string'	에 암시적으로 'any'형식이 있습니다.
```
값의 관점에서 Person과 string이 해석되었기 때문에, 오류가 발생한다.
Person이라는 변수명과, string이라는 이름의 변수를 생성하였기 때문이다.
문제를 해결하기 위해서는 타입과 값을 구분하여 적어야 한다.
```ts
function email ({person, subject, body}: {person: Person, subject: string, body: string}) {
  //...
}
```
매개변수에 대한 타입을 정확하게 지정해주어야 에러가 발생하지 않는다.