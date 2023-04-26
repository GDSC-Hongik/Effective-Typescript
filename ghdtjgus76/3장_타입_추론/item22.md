## *아이템 22 타입 좁히기*

*타입 좁히기는 타입스크립트가 넓은 타입으로부터 좁은 타입으로 진행하는 과정을 말한다.*

*아래 코드는 가장 일반적인 예시인 null 체크이다.*

*첫 번째 블록에서 HTMLElement | null 타입의 null 타입을 제외하기 때문에 더 좁은 타입이 된다.*

```jsx
const el = document.getElementById('foo');  // 타입이 HTMLElement | null

if (el) {
    el;  // 타입이 HTMLELement
} else {
    el;  // 타입이 null
}
```

*타입 체커는 조건문 같은 경우 타입 좁히기를 수월하게 하지만 타입 별칭이 존재하는 경우 그러지 못할 수도 있다.*

*분기문에서 예외를 던지거나 함수를 반환해 블록의 나머지 부분에서 변수의 타입을 좁힐 수도 있다.*

```jsx
const el = document.getElementById('foo');  // 타입이 HTMLElement | null

if (!el) throw new Error('Unable to find #foo');
el;  // 타입은 HTMLElement
```

*instanceof를 사용해서 타입을 좁힐 수도 있다.*

```jsx
function contains(text: string, search: string|RegExp) {
    if (search instanceof RegExp) {
        search;  // 타입이 RegExp
    } 

    search;  // 타입이 string
}
```

*속성 체크로도 타입을 좁힐 수 있다.*

```jsx
interface A {
    a: number;
}

interface B {
    b: number;
}

function pickAB(ab: A | B) {
    if ('a' in ab) {
        ab;  // 타입이 A
    } else {
        ab;  // 타입이 B
    }

    ab;  // 타입이 A | B
}
```

*Array.isArray와 같은 일부 내장 함수로도 타입 좁히기가 가능하다.*

```jsx
function contains(text: string, terms: string|string[]) {
    const termList = Array.isArray(terms) ? terms : [terms];
    termList;  // 타입이 string[]
}
```

*명시적 태그를 붙여 타입을 좁히는 방법도 있다.*

*이 패턴은 ‘태그된 유니온’ 또는 ‘구별된 유니온’이라고 불린다.*

```jsx
interface UploadEvent {
    type: 'upload',
    filename: string;
    contents: string;
}

interface DownloadEvent {
    type: 'download',
    filename: string;
}

type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
    switch(e.type) {
        case 'download':
            e;  // 타입이 DownloadEvent
            break;
        case 'upload':
            e;  // 타입이 UploadEvent
            break;
    }
}
```

*타입스크립트가 타입을 식별하지 못한다면, 식별을 돕기 위해서 커스텀 함수를 도입할 수 있다.*

*이러한 방식을 ‘사용자 정의 타입 가드’라고 한다.*

*반환 타입의 el is HTMLInputElement는 함수의 반환이 true인 경우, 타입 체커에게 매개 변수의 타입을 좁힐 수 있다고 알려 준다.*

```jsx
function isInputElement(el: HTMLElement): el is HTMLInputElement {
    return 'value' in el;
}

function getElementContent(el: HTMLElement) {
    if (isInputElement(el)) {
        el;  // 타입이 HTMLInputELement
    } 

    el;  // 타입이 HTMLElement
}
```

*다음과 같이 타입 가드를 사용해서 배열/객체의 타입 좁히기를 할 수도 있다.*

*아래 코드에서 filter 함수를 사용해서 undefined를 걸러내려고 해도 잘 동작하지 않는데, 타입 가드를 사용하면 타입을 좁힐 수 있다.*

```jsx
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];

const members = ['Janet', 'Michael'].map((who) => jackson5.find((n) => n === who));
// 타입이 (string | undefined)[]
```

```jsx
const jackson5 = ['Jackie', 'Tito', 'Jermaine', 'Marlon', 'Michael'];

const members = ['Janet', 'Michael'].map(
    (who) => jackson5.find((n) => n === who)
    ).filter((who) => who != undefined);
// 타입이 (string | undefined)[]
```

```jsx
function isDefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}

const members = ['Janet', 'Michael'].map(
    who => jackson5.find(n => n === who)
).filter(isDefined);  // 타입이 string[]
```