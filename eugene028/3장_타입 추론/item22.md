# item22

# 타입스크립트의 타입 좁히기
타입스크립트에서 타입을 좁히는 과정을 알아보도록 하자. 타입을 좁혀나간다는 것은 어떤 의미일까?
지난 글에서 타입을 넓히기 때문에 **상수와 타입이 추론된다는 점을** 이해하였다. 이번 글에서는 타입 좁히기를 통하여 넓은 타입에서 작은 타입으로 타입을 체크하는 것을 지켜보고자 한다. 타입을 좁히는 방법에는 여러 가지가 존재한다.
## 타입을 좁히는 방법들
###  1. null 체크
```ts
const el = document.getElementById('foo'); //타입이 HTMLElement | null
if (el) {
  el //타입이 HTMLElement
  el.innerHTML = 'Party Time'.blink();
} else {
  el //타입이 null
  alert('No element #foo');
}
```
만약 `el`이 `null`이라면, 분기문의 첫번째 블록이 실행되지 않는다. 즉, 첫 번째 블록에서 `HTMLElement | null` 타입의 `null`을 제외하기 때문이다.
그래서 더 **좁은 타입이 되어**서 작업이 훨씬 수월해진다. 
이러한 과정을 *타입 좁히기* 라고 한다.

###  2. 예외문 사용하기
```ts
const el = document.getElementById('foo');
if (!el) throw new Error('Unable to find #foo');
el;
el.innerHTML = 'Party Time'.blink();
```
예외를 사용하여 `null`타입을 통과한 경우에는 `HTMLElement` 타입으로 둬 타입을 좁혀간다.

###  3. instanceof 사용하기

```ts
function contains(text: string, search: string|RegExp) {
  if (search instanceof RegExp) {
    search //타입이 RegExp
    return !!search.exec(text);
  }
  search //타입이 string
  return text.includes(search);
}
```
### 4. 속성 체크하기
```ts
interface A { a: number }
interface B { b: number }
function pickAB(ab: A | B ) {
  if ('a' in ab) {
    ab //타입이 A
  } else {
    ab //타입이 B
  }
  ab //타입이 A | B
}
```

위와 같이 타입을 좁히는 데에는 `if`문이 매우 잘 사용된다. 그러나, `if`문을 사용하여 타입을 좁힐 때 주의해야 할 점이 존재한다.
```ts
const el = document.getElementById('foo'); //타입은 HTMLElement | null
if (typeof el === 'object') {
  el;
}
```
타입스크립트에서 `typeof null`은 `object`이기 때문에, 조건문에서 `null`이 올바르게 제외되지 않는다. 이런 부분들에서 에러가 발생하지 않도록 주의하자.

## 타입을 좁히는 일반적인 방법
### 1. 명시적 '태그' 붙이기
```ts
interface UploadEvent { type: 'upload'; filename: string ; contents: string }
interface DownloadEvent { type: 'download'; filename: string; }
type AppEvent = UploadEvent | DownloadEvent;
function handleEvent(e: AppEvent) {
  switch (e.type) {
    case 'download':
      e
      break;
    case 'upload':
      e;
      break;
```
이러한 패턴은 **태그된 유니온** 또는 **구별된 유니온**이라고 부른다
### 2. 사용자 정의 타입 가드 작성하기
타입을 식별하지 못할 때, 식별을 돕기 위하여 커스텀 함수를 작성할 수 있다.
여기서 내가 크게 공감했던 코드가 있는데, 타입스크립트를 이용하여 배열을 작성할 때 가장 많이 마주쳤던 친구이다..
```ts
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael']
const memebers = ['Janet', 'Michael'].map(
  who => jackson5.find(n => n === who)
); //타입은 (string | undefined)[]
```
여기서 `undefined`가 존재하기 때문에 작성하고 싶은 코드를 자유롭게 작성하지 못한 경우가 많다. 이 때 나는 `filther`함수를 이용하여 `undefined`라고 찍히는 친구들을 걸러내고 싶었는데...
```ts
const memebers = ['Janet', 'Michael'].map(
  who => jackson5.find(n => n === who)
).filther (who => who !== undefined); //타입이 (string | undefined)[]
```
이렇게 코드를 작성하여도 `undefined`는 걸러지지 않는다.. ㅠㅠ
이럴 때, 타입 가드를 작성하면 `undefined`를 걸러낼 수 있다.
```ts
function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
const members = ['Janet', 'Michael'].map(
  who => jackson5.find(n => n === who)
).filter(isDefined); //타입은 string[]
```
이제 배열에 존재하는 `undefined`가 안지워진다고 고생하지 말고 타입 가드 함수를 작성하자~