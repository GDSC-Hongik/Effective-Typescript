# item26
# 타입 추론에 문맥이 어떻게 사용되는지 이해하자.
타입스크립트는 단순히 타입을 추론할 때 해당 값만을 고려하는 것이 아니라 문맥까지 고려하여 타입을 추론합니다.
```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python';
function setLanguage(language: Language) {/*...*/}
setLanguage('JavaScript'); //정상
let language = 'JavaScript';
setLanguage(language); //'string'형식의 인수는 Language 매개변수에 할당될 수 없습니다.
```
이런 경우에는 `language`에 정확히 타입을 명시함으로써 해결할 수 있다. 두 가지 해결법을 확인해보자.
## 문맥과 값을 분리한다는 것..
### 1. language의 가능한 값 제한
```ts
let language: Language = 'JavaScript';
setLanguage(language);//정상
```
### 2. language를 상수로 만들기
```ts
const language = 'JavaScript';
setLanguage(language); //정상
```
`const`를 사용하여 `language`는 더이상 변경할 수 없다는 것을 알려주는 것이다. 그래서 **더욱 정확한 타입인 문자열 리터럴**로 판단되어 타입 체크를 통과한다.

## 튜플 사용 시 주의점
```ts
function panTo(where: [number, number]) {/*...*/}
panTo([10, 20]) //정상
const loc = [10, 20];
panTo(loc);
// ~~'number[]' 형식의 인수는 '[number, number]' 형식의 매개변수에 할당될 수 없습니다
```
문맥과 값을 분리하였기 때문에 오류가 발생하였다. `loc`이 `number[]`로 추론되었기 때문! 해결해보도록 하자.
### 1. 타입 선언
```ts
const loc: [number, number] = [10, 20];
panTo(loc) //정상
```
### 2. 상수 문맥 제공
`const`는 값이 가리키는 참조가 변하지 않는 얕은 상수이다. 그러나 `as const`는 그 값이 내부까지 상수라는 사실을 타입스크립트에게 안내한다.
```ts
const loc = [10, 20] as const;
panTo(loc);
```
그런데 타입은 `number[]`가 아니라, `readonly [10, 20]`로 추론된다. 너무 **과하게**추론된 것을 알 수 있다.
오류를 고칠 수 있는 최선의 방법은 `panTo` 함수에 `readonly` 구문을 추가하는 것이다.
```ts
function panTo(where: readonly [number, number]) {/*...*/}
const loc = [10, 20] as const;
panTo(loc);
```
그러나 `as const`는 타입 정의에 실수가 있었을 때 그곳에서 오류가 발생하지 않고, **호출되는 곳에서** 오류가 발생한다. 그렇기 때문에 여러 번 중첩된 객체에서 오류가 발생한다면 근본적인 원인을 파악하기 힘들어진다.

## 객체 사용 시 주의점
객체 사용 시에도 주의해야 한다.
```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python';
interface GovernedLanguage {
  language: Language;
  organization: string;
}
function complain(language: GovernedLanguage) {/*...*/}
complain({language: 'TypeScript', organization: 'Microsoft' });
const ts = {
  language: 'TypeScript',
  organization: 'Microsoft',
}
complain(ts);
```
여기서 `language`의 타입은 `string`으로 추론된다. 그래서 **타입 선언**을 따로 추가해주거나, **상수 단언(as const)**를 이용하여 해결해줄 수 있다.
```ts
const ts = {
  language: 'TypeScript',
  organization: 'Microsoft',
} as const
```
