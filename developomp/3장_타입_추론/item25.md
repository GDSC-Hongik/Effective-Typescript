# 비동기 코드에는 콜백 대신 async 함수 사용하기

## 자바스크립트에서의 비동기 코드

- ECMAScript 2015 (ES6): Promise 객체가 추가
- ECMAScript 2015 (ES6): async/await 문법 추가

콜백 함수의 단점:

- callback hell의 가능성
- 코드 실행 순서가 코드 순서와 다름
- `Promise.all`, `Promise.race` 등의 고급 기능을 직접 구현해야 함
- 코드 중첩

## 타입스크립트에서의 비동기 코드

- 비동기 함수의 리턴 타입은 `Promise<T>`임
  - async 함수의 경우 직접 명시하지 않아도 `Promise<T>` 타입으로 추론됨
- 직접 `Promise`를 사용하는 것보다 `async`/`await`을 사용하는 것이 더 간결하고 직관적
