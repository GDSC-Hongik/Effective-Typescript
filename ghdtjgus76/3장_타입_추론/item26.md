## 아이템 26 타입 추론에 문맥이 어떻게 사용되는지 이해하기

타입스크립트는 타입 추론 시 값뿐만 아니라 값이 존재하는 곳의 문맥까지도 고려한다.

```tsx
type Language = 'Typescript' | 'Javscript' | 'Python';

function setLanguage(language: Language) {}

setLanguage('Javscript');

let language = 'Javascript';
setLanguage(language);
// ~ 'string' 형식의 인수는
// 'Language' 형식의 매개변수에 할당될 수 없다.
```

위 코드를 살펴보자.

setLanguage 함수의 경우 문자열 리터럴 ‘Javascript’는 매개 변수인 Language 타입에 할당이 가능하다.

하지만, 이 값을 변수로 분리하면 타입스크립트는 할당 시점에 타입을 추론하고, 이때 string으로 추론되므로, Language 타입으로 할당이 불가능해 오류가 발생했다.

이에 대한 해결 방안이 두 가지 있다.

 

첫 번째 해결 방안은 타입 선언에서 language의 가능한 값을 제한하는 것이다.

```jsx
let language: Language = 'Javascript';
setLanguage(language);
```

두 번째 해결 방안은 language를 상수로 만드는 것이다.

```jsx
const language = 'Javascript';
setLanguage(language);
```

이처럼 const로 선언해주면 타입스크립트는 language에 대해 더 정확한 타입인 문자열 리터럴 ‘Javascript’로 추론할 수 있다.

이렇게 문맥과 값을 분리하면 문제가 발생할 수 있다. 

이에 대한 예와 해결법을 앞으로 살펴볼 것이다.

### 튜플 사용시 주의점

  

아래 코드를 한 번 살펴보자.

```
function panTo(where: [number, number]) {}

panTo([10, 20]);

const loc = [10, 20];
panTo(loc);
// ~ 'number[]' 형식의 인수는
// '[number, number]' 형식의 매개 변수에 할당할 수 없다.
```

이 예에서도 문맥과 값을 분리했다.

이에 대한 해결 방법으로는 위 예제에서 해결 방법과 같이 타입스크립트가 정확히 의도를 파악할 수 있도록 타입 선언을 제공하는 것이다.

```jsx
function panTo(where: [number, number]) {}

panTo([10, 20]);

const loc: [number, number] = [10, 20];
panTo(loc);
```

또 다른 해결 방법으로는 상수 문맥을 제공하는 것이다.

```jsx
const loc: [10, 20] as const;
panTo(loc);
// ~ 'readonly [10, 20]' 형식은 'readonly'이며
// 변경 가능한 형식 '[number, number]'에 할당할 수 없다.
```

const는 값이 가리키는 참조가 변하지 않는 얕은 상수를 나타내는데, as const는 그 값이 내부까지 상수라는 사실을 타입스크립트에게 알려준다.

panTo의 타입 시그니처는 where의 내용이불변이라고 보장하지 않아 loc 매개변수가 readonly 타입이므로 동작하지 않는다.

이때 panTo 함수에 readonly 구문을 추가하면 문제가 해결된다.

```jsx
function panTo(where: readonly [number, number]) {}

const loc = [10, 20] as const;
panTo(loc);
```

하지만, as const는 타입 정의에 실수가 있다면 오류는 타입 정의가 아니라 호출되는 곳에서 발생한다는 단점이 있다.

특히 여러 겹 중첩된 객체에서 오류가 발생하면 원인을 파악하기 어렵다.

```jsx
const loc = [10, 20, 30] as const;  // 실제 오류가 발생하는 곳
panTo(loc);
// ~ 'readonly [10, 20, 30]' 형식의 인수는
// 'readonly [number, number]' 형식의 매개 변수에 할당될 수 없다.
// 'length' 속성의 형식이 호환되지 않는다.
// '3' 형식은 '2' 형식에 할당할 수 없다.
```

### 객체 사용 시 주의점

문맥에서 값을 분리하는 문제는 문자열 리터럴이나 튜플을포함하는 큰 객체에서 상수를 뽑아낼 때도 발생한다.

```jsx
 type Language = 'Javascript' | 'Typescript' | 'Python';

interface GovernedLanguage {
    language: Language;
    organization: string;
}

function complain(language: GovernedLanguage) {}

complain({ language: 'Typescript', organization: 'Microsoft' });

const ts = {
    language: 'Typescript',
    organization: 'Microsoft'
};

complain(ts);
// ~ '{ language: string; organization: string; } 형식의 인수는
// 'GovernedLanguage' 형식의 매개 변수에 할당될 수 없다.
// 'language' 속성의 형식이 호환되지 않는다.
// 'string' 형식은 'Language' 형식에 할당할 수 없다.
```

이 문제는 타입 선언을 추가하거나(const ts: GovernedLanguage = …) 상수 단언(as const)를 사용해서 해결한다. 

### 콜백 사용 시 주의점

콜백을 다른 함수로 전달 시 타입스크립트는 콜백의 매개변수 타입을 추론하기 위해 문맥을 사용한다.

```jsx
function callWithRandomNumbers(fn: (n1: number, n2: number) => void) {
    fn(Math.random(), Math.random());
}

callWithRandomNumbers((a, b) => {
    a;  // 타입이 number
    b;  // 타입이 number

		console.log(a+b);
})
```

callWithRandom의 타입 선언으로 a와 b의 타입이 number로 추론된다.

이때, 콜백을 상수로 뽑아내면 문맥이 소실되고 noImplicitAny 오류가 발생한다. 

```tsx
const fn = (a, b) => {
    // ~ 'a' 매개변수에는 암시적으로 'any' 형식이 포함된다.
    // ~ 'b' 매개변수에는 암시적으로 'any' 형식이 포함된다.
    console.log(a+b);
}

callWithRandomNumbers(fn);
```

이런 경우는 타입 구문을 추가해서 해결할 수 있다.

```tsx
const fn = (a: number, b: number) => {
    console.log(a+b);
}

callWithRandomNumbers(fn);
```

또는 가능한 경우 전체 함수 표현식에 타입 선언을 적용해도 된다.