# item2: 타입스크립트 설정 이해하기
타입스크립트에서 사용되는 중요한 설정 몇가지를 함께 살펴보자.
타입스크립트 설정은 아래 두가지 명령어를 통하여 확인할 수 있다.
`$tsc --noImplicityAny program.ts`
`.tsconfig.json` 설정 파일 작성

협업의 편리함을 위하여 .tsconfig.json 파일을 작성하여 사용하는 것이 좋다.

## noImplicitAny
```js
function add(a,b) {
  return a + b;
}
```
이런 상태로 코드를 타입스크립트에게 데려가면, any 타입으로 추론을 하게 된다. 이는 암시적 any가 되는 것으로, 타입스크립트를 사용한느 가장 주된 목적을 무력화 시키는 것이므로, 되도록이면 해당 설정은 켜 둔 채로 타입스크립트를 이용하는 것이 좋다.

만약 정말 사용하고 싶다면, 기존 자바스크립트로 작성했던 코드를 타입스크립트로 가져올 때 유효하다고 할 수 있다.

## strictNullChecks
```js
const x:number = null;
```
해당 코드에서 오류가 발생한다. 그 이유는 null 과 undefined가 마구마구 사용되는 것을 방지하기 위해서이다. 해당 설정을 꺼 두려면 명시적으로 의도를 나타내거나, null과 undefined의 출처를 명확히 밝혀야한다.

해당 에러를 방지하기 위하여 아래와 같이 코드를 작성하는 습관을 들여야 한다 !
```js
const x: number | null = null;
```
```js
const el = document.getElementById('status');
el.textContent = 'Ready';
if (el) {
  el.textContent = 'Ready';
}
el!.textContent = 'Ready';
```