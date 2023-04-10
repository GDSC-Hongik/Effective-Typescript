# 타입 넓히기

자바스크립트에서 변수는 런타임에 유일한 값을 가지고, 타입스크립트에서 변수는 정적 분석 시간에
"가능한" 값들의 집합인 타입을 가진다. 여기서 변수를 초기화할 때 지정된 단일 값을 가지고 할당
가능한 값들의 집합, 즉 타입을 유추하는 과정을 타입 넓히기(widening)라고 부른다.

## mixed type

```ts
const tuple = [0, "a"];
```

위 코드에서 tuple은 `(string | number)[]`타입으로 추론되지만 `[number, string]`,
`[0, "a"]`, `(0|"a")[]` 등 여러 유효한 타입 후보들이 있다. 변수 초기화 시 주어진 값으로
추론 가능한 타입 후보는 여러 개이기 때문에 실제 개발자의 의도와 다르게 추론될 수 있는 것이다.

## let과 const의 차이

타입스크립트에서 `let`과 `const`에서의 타입 추론은 다르게 동작한다. `let`을 사용하는
경우엔 변수가 재할당 될 수 있고 `const`를 사용하면 재할당의 가능성이 없기 때문이다.

```ts
function setMode(mode: 0 | 1 | 2) {
  console.log("mode is set to:", mode);
}

let x = 0; // x는 number 타입으로 추론됨
const y = 0; // y는 0 리터럴 타입으로 추론됨

setMode(x); // 에러!
setMode(y); // 정상!
```

위 코드에서 `setMode(x)`는 자바스크립트에서 제대로 동작하지만 타입스크립트에서는 `x`의
타입이 `number`이고, 이는 `0 | 1 | 2`타입보다 큰 집합이기 때문에 에러가 발생한다.

## as const

위 코드 예제에서는 `const`를 사용함으로서 변수의 타입이 리터럴 타입이 되었지만, 모든 값에
대해 이러한 결과를 기대할 수 있는 것은 아니다.

```ts
type Setting = { mode: 0 | 1 | 2 };

const setting: Setting = { mode: 0 };
```

위 코드에서 `setting.mode`는 `setting`을 정의할 때 `const`를 사용했음에도 `0` 리터럴
타입이 아닌 `0 | 1 | 2` 타입을 가진다. 이때 `as const`를 사용하고 `Setting` 타입으로
선언하지 않으면 `setting` 변수의 타입을 리터럴 타입으로 지정할 수 있다.

```ts
// setting은 {
//     readonly mode: 0;
// } 리터럴 타입으로 추론됨
const setting = { mode: 0 } as const;
```
