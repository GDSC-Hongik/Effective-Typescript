래퍼 객체를 피하기 전에, 래퍼 객체가 무엇인지 정확히 알아야 왜 피해야 하는지 알 수 있는 법이다. 먼저 *Js Deep Dive*에 있는 책을 정리하여, 래퍼 객체가 무엇이고 어떻게 동작하는지 알아보자.

자바스크립트에는 원시값으로 활용할 수 있는 일곱가지 타입이 있다.
`number`, `boolean`, `null`, `undefined`, `symbol`, `bigint` 가 존재한다.
기본형들은 원시값이고, **불변**이기 때문에, 메서드를 가지고 있지 않다.

그러나, 아래 코드를 보면 마치 원시값이 객체처럼 동작하는 경우가 존재한다.
```ts
const str = 'hello';

console.log(str.length);
console.log(str.toUpperCase());
```
원시값에 객체처럼 마침표 표기법으로 접근하면, 자바스크립트 엔진이 **암묵적으로 원시값을 연관된 객체로 변환**해준다. 그래서 임시로 생성된 객체를 통하여 프로퍼티에 접근하거나, 매서드를 호출하고 다시 원시값으로 되돌린다고 한다.

이렇게 **문자열, 숫자, 불리언 값에 대하여 객체처럼 접근하면 생성되는 임시 객체를 래퍼 객체라고 한다**

```ts
'primitive'.charAt(3)
```
이 코드를 실행시켰을 때, `래퍼 객체`인 **String 생성자 함수**의 인스턴스가 실행되고, 문자열은 래퍼 객체의 `[[StringData]]`	내부 슬롯에 할당된다.
이 때, 해당 문자열은 임시적으로 `String.prototype`의 메서드를 상속받아 사용한다. 
![](https://velog.velcdn.com/images/gene028/post/3d599e3f-80ab-4795-845e-3bfefa674949/image.png)

이러한 형식으로 원시값을 가지는 기본형을 임시적으로 객체로 `래핑`하고, 마지막에는 래핑한 객체를 버린다.
이러한 현상을 자세히 보고 싶으면, **<a href= "https://donggov.tistory.com/211">몽키 패치</a>**를 통하여 알아볼 수 있다.
당연히 임시적으로 객체가 배정되는 것이기 때문에, 메서드 내에 있는 `this`는 `String 객체 래퍼`이다.

이렇게 평화롭게 작동되기만 하면 얼마나 좋을까..
> 원시 타입 string과 String 객체 래퍼가 항상 동일하게 동작하지 않는다.

## 1. 객체는 오직 자기 자신과 동일하다
```ts
"hello" === new String("hello")
new String("hello") === new String("hello")
```
이 부분은 당연히 객체가 생성됨으로 인하여 다른 주소값을 가지기 때문에 다른 객체를 가리키기 때문에 `false`라는 답을 도출한다.

## 2. 유령처럼 사라지는 래퍼 타입
```
x = "hello"
x.language = 'English'
>'English'
x.language
>undefined
````
`English`라는 프로퍼티를 잘 전달한 게 아닌가? 싶지만, 래퍼 객체는 원시값으로 돌아올 때 **객체를 버리므로** 할당되었던 프로퍼티는 함께 삭제된 것이다. 

## 3. 구분되는 기본형과 객체 래퍼 타입
타입스크립트에서는 기본형과 객채 래퍼 타입을 별도로 모델링한다.
그래서 `string` 과 `String`을 명확하게 구분하고 있어야 한다.

`String`은 객체, `string`은 원시 값이기 때문에, 매개변수로 원시 값을 전달받는 곳에 `String`을 전달하면 문제가 발생하기 때문이다.

타입스크립트가 제공하는 타입 선언은 **전부 기본형 타입**으로 되어 있어 객체 래퍼 타입은 지양하고, 기본형 타입을 사용해야  한다.

물론, `string`은 앞서 말한 임시 객처 래퍼 현상에 따라 `String`에 할당할 수 있다.
하지만 반대로는 수행되지 않고, 혼란을 야기할수 있기에 피하도록 하자.

