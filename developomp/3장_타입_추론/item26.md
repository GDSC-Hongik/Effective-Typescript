# 타입 추론에 문맥이 어떻게 사용되는지 이해하기

타입스크립트에서 타입을 추론할 때 단순히 값뿐만 아니라 값이 존재하는 문맥 또한 고려된다.

## inline의 경우

```ts
type Language = "kr" | "en";

function setLanguage(language: Language) {}

let lang1 = "kr";
setLanguage(lang1); // ERROR

const lang2 = "en";
setLanguage(lang2); // OK

setLanguage("kr"); // OK
```

위 코드에서 `lang1`과 `lang2`의 경우 앞에서 배운 대로 각각 `string`과 `"en"` 리터럴
타입으로 추론된다는 것을 알고 있다. 인라인 형태의 값의 경우에는 `lang2`와 마찬가지로 값의
리터럴 타입으로 추론되고, 그 타입은 `Language`와 호환되기 때문에 에러가 발생하지 않는다.

## 튜플의 경우

```ts
const arr = [1, 2];

arr.push(3);

console.log(arr); // [ 1, 2, 3 ]

function gotoXYZ(coords: [number, number, number]) {}

gotoXYZ(arr);
gotoXYZ([1, 2, 3]);
```

위 코드에서 `arr`은 `const`로 정의되었지만 그 값은 여전히 변할 수 있기 때문에 타입은
`[number, number]`가 아니라 `number[]`로 추론되므로 자바스크립트에서 동작함에도 불구하고
타입스크립트에서는 컴파일 에러가 발생한다.

## const 단언문의 경우

타입스크립트에서 [const 단언문](type-assertions)을 사용하면 리터럴 타입으로 단언된다.

타입 단언문 사용 예 (let이 사용함에도 불구하고 에러가 없음에 주목하자):

```ts
let tuple = [1, 2, 3] as const; // readonly [1, 2, 3]
let num = 0 as const; // 0
let str = "hello" as const; // "hello"
let obj = {
  text: "hello",
} as const; // { readonly text: "hello" };
```

[튜플 코드](#튜플의-경우)를 수정한 코드:

```ts
let arr = [1, 2, 3] as const;

function gotoXYZ(coords: readonly [number, number, number]) {}

gotoXYZ(arr);
gotoXYZ([1, 2, 3]);
```

## 객체의 경우

```ts
type Language = "light" | "dark";

function setTheme(lang: Language) {}

const settings = {
  theme: "light",
};

setTheme(settings.theme); // 에러 발생!!
```

위 코드의 경우 `settings` 객체의 `theme` 프로퍼티는 `string` 타입으로 추론되고, 이는
`Language` 타입에 할당할 수 없기 때문에 `setTheme` 함수가 사용되는 줄에서 에러가 발생한다.
const 단언문을 사용하면 에러가 사라진다.

## 콜백 함수의 경우

```ts
const arr = [0, 1, 2];

arr.sort((a, b) => a - b);
```

위 코드의 경우 `arr` (`number[]` 타입의) 배열의 `sort` 함수는
`(a: number, b: number) => number` 콜백 함수 (또는 `undefined`)를 인자로 받기 때문에
`a`와 `b` 모두 `number` 타입으로 추론된다.

[type-assertions]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
