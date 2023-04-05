## *아이템 12 함수 표현식에 타입 적용하기*

*자바스크립트, 타입스크립트에서는 함수 ‘문장’과 함수 ‘표현식’을 다르게 인식한다.*

```jsx
function rollDice1(sides: number): number {}  // 문장
const rollDice2 = function (sides: number): number {}  // 표현식
const rollDice3 = (sides: number): number => {}   // 표현식
```

*타입스크립트에서는 함수의 매개변수부터 반환값까지 전체를 함수 타입으로 선언하여 함수 표현식에 재사용할 수 있어 함수 표현식을 사용하는 것이 좋다.*

```jsx
type DiceRollFn = (sides: number) => number;
const rollDice: DiceRollFn = sides => {}
```

*다음과 같이 함수 타입 선언을 이용하면, 반복되는 함수 시그니처를 하나의 함수 타입으로 통합할 수 있다.*

*불필요한 코드의 반복을 줄일 뿐 아니라 함수 구현부도 분리되어 있어 로직이 분명해진다.*

```jsx
function add(a: number, b: number) { return a + b; }
function sub(a: number, b: number) { return a - b; }
function mul(a: number, b: number) { return a * b; } 
function div(a: number, b: number) { return a / b; }
```

```jsx
type BinaryFn = (a: number, b: number) => number;

const add: BinaryFn = (a, b) => (a+b);
const sub: BinaryFn = (a, b) => (a-b);
const mul: BinaryFn = (a, b) => (a*b);
const div: BinaryFn = (a, b) => (a/b);
```

*아래 코드에서 /quote가 존재하지 않는 API라면, ‘404 Not Found’ 관련 내용을 응답한다.*

*응답이 JSON 형식이 아닐 수 있다.*

*response.json()은 JSON 형식이 아니라는 새로운 오류 메시지를 담아 rejected promise를 반환한다.*

*호출한 곳에서는 새로운 오류 메시지가 전달돼 실제 오류인 404가 감춰진다.*

*또한, fetch 실패 시 거절된 프로미스를 응답하지는 않는다.*

*따라서 상태 체크를 수행해줄 함수를 작성하였다.*

*두 번째 코드에서는 조금 더 간결하게 코드를 작성하였는데, 함수 표현식으로 바꾸고, 함수 전체에 타입(typeof fetch)를 적용하였다.*

*(다른 함수의 시그니처를 참조하려면 typeof fn을 사용하면 되기 때문)*

*이 방식은 타입스크립트가 input과 init의 타입을 추론할 수 있게 해준다.*

*이때 checkedFetch 함수 내부에서 throw가 아니라 return을 사용할 경우 오류가 발생하니 주의해야한다.*

```jsx
async function getQuote() {
    const response = await fetch('/quote?by=Mark+Twain');  // 타입이 Promise<Response>
    const quote = await response.json();

    return quote;
}

async function checkedFetch(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);

    if (!response.ok) {
        // 비동기 함수 내에서는 거절된 프로미스로 변환한다.
        throw new Error('Request failed ' + response.status);
    }

    return response;
}
```

```jsx
// 조금 더 간결한 코드 작성
const checkedFetch: typeof fetch = async (input, init) => {
    const response = await fetch(input, init);

    if (!response.ok) {
        throw new Error('Request failed ' + response.status);
    }

    return response;
}
```

*함수의 매개변수에 타입 선언을 하는 것보다 함수 표현식 전체 타입을 정의하는 것이 코드도 간결하고 안전하다.*

*동일한 타입/타입 시그니처를 가지는 여러 함수 작성 시에는 함수 전체 타입 선언을 적용해야한다.*