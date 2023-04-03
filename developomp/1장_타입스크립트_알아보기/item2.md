# item2: 타입스크립트 설정 이해하기

타입스크립트 컴파일러 (`tsc`) 설정은 CLI 옵션을 통해 설정할 수도 있지만 사용의 번거로움과
IDE 기능 사용을 위해 주로 `tsconfig.json` 파일을 통해 설정된다. 참고로 타입스크립트를
쓰지 않으면서 타입스크립트 컴파일러의 기능을 사용하고 싶다면 [`jsconfig.json` 파일]을
작성하면 된다.

타입스크립트 컴파일러의 주요 설정 두 가지를 살펴보자. 아래 두 설정들은 `strict` 옵션을
사용하면 자동으로 활성화된다.

## `noImplicitAny`

```js
function add(a, b) {
  return a + b;
}
```

타입스크립트 컴파일러는 별다른 설정이 없었을 때 위 함수에 대해 다음과 같은 타입을 추론해낸다:

```ts
function add(a: any, b: any): any;
```

여기서 주목해야 할 점은 타입을 명시하지 않아도 "암묵적으로" (implicitly, 혹은 암시적으로)
`any` 타입을 추론해냈다는 점이다. 이 기능은 자바스크립트 코드를 타입스크립트로 마이그레이션
할 때 유용할 수 있으나 타입스크립트의 장점을 무효화시키기 때문에 의도적으로 사용하는 것은
지양해야 한다.

여기서 `noImplicitAny` 설정은 타입스크립트 컴파일러가 `any` 타입을 추론하게 하는 대신
에러를 발생시키게 한다.

## `strictNullChecks`

```ts
const x: number = null;
const y: number = undefined;
```

일반적으로 위 타입스크립트 코드는 에러를 발생시키지 않지만, `strictNullChecks` 설정을
사용하면 에러를 발생시킨다 (그런데 `const a: number = NaN;`은 또 제대로 돌아간다).

이 설정은 `null`이거나 `undefined`인 객체를 사용할 때 발생할 수 있는 런타임 에러를 잡기
위해 사용된다.

만약 `null` 혹은 `undefined` 타입이 필요하다면 [유니언 타입]의 사용을 권장한다.

```ts
const x: number | null = null;
```

[`jsconfig.json` 파일]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
[유니언 타입]: https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html
