# 타입 단언보다는 타입 선언을 사용하기

타입스크립트에서 **변수에 값을 할당하고, 타입을 부여하는 방법은 두 가지**가 있는데,
```ts
interface Person { name: string };

const alice: Person = { name: 'Alice'}; 
const bob = { name: 'Bob' } as Person;
```
첫번째는 변수에 `Person`이라는 **타입 선언**을 붙여서, 그 값이 선언된 타입임을 명시한다.
두번째는 `as Person` 이라는 **타입 단언**을 수행한다. 그러면 타입스크립트가 추론한 것이 있더라도, **Person 타입**으로 간주한다.

>타입 단언보다는 **타입 선언**을 사용하라.

## 그럼 왜 타입 선언을 사용해야 하는가?
타입 선언은 할당되는 값이 해당 **인터페이스를 만족하는지 검사한다**
이 개념도 결국은 구조적 타이핑과 연결되는 것인데, 
타입 단언을 사용할 경우, 타입스크립트가 개발자의 워딩을 믿고, Duck타입으로 인식하여 객체의 형식이 일치하지 않아도 에러를 발생시키지 않는데, 타입 선언을 사용할 경우 인터페이스를 확인하기 때문에 안정성이 높다고 할 수 있다. 아래 예시를 보자.
```ts
const alice: Person = {
  name: 'Alice',
  occupation: 'TypeScript developer'
  //'Person'형식에 'occupation'이 없습니다.
};
const bob = {
  name: 'Bob',
  occupation: 'JavaScript'
} as Person; //오류 없음
```
타입 선언은 아래 화살표 함수를 작성할 때에도 중요한 역할을 할 수 있다.
타입 단언으로 화살표 함수를 정의해보자.
```
const people = ['alice', 'bob', 'jan'].map(name => ({} as Person));
```
이 코드가 오류가 없다고 한다. 
사실은 `name` 프로퍼티가 없는데도 오류가 없다고 하니, 참 이상하다.
전에도 이야기했듯이 타입 단언을 사용하면 타입스크립트가 객체의 형식이 일치하지 않아도 이러한 형식을 구조적 타이핑에 의해 허용하기 때문에 별 문제가 없다고 판단하는 것이다.

```ts
const people: Person[] = ['alice', 'bob', 'jan'].map(
  (name): Person => ({name})
);
```
여기서 소괄호를 잘 쓰는 것을 주의해야 한다.
`(name: Person)` 이렇게 쓰면, name의 타입이 Person임을 명시하고, 반환하는 타입은 없기 때문에 오류가 발생하기 때문이다.

## 타입 단언을 사용하는 게 좋을 때도 있다.
### 1. DOM Element
타입 단언은 타입 체커가 추론한 타입보다, 내가 판단하는 타입이 **더욱 정확할 때** 의미가 있다.
DOM 엘리먼트 같은 것은, 타입스크립트가 직접 접근하지 못하기 때문에 타입스크립트보다 내가 작성을 잘 해주는 것이 좋을 것이다.
```ts
document.querySelector('#myButton').addEventListener('click, e => {
	e.currentTarget //EventTarget 
    const button = e.currentTarget as HTMLButtonElement;
});
```
### 2. null이 아님을 단언하는 경우
```ts
const elNull = document.getElementById('foo');
//타입은 HTMLElement | null
const el = document.getElementById('foo')!;
//타입은 HTMLElement
```
이 때, 접미사에 사용된 `!` 은 단언문으로 생각해야 하며, 컴파일 과정 중에 제거되기 때문에 **Null이 아니라고 확신할 수 있을때만 사용해야 한다!!**


                                           