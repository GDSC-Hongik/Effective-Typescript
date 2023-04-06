# item12

다음 두 코드는 차이가 있다.
```ts
function rollDice1(sides: number): number { /* ... */ }
const rollDice2 = function(sides: number): number { /* ... */ }
const rollDice3 = (sides: number) : number => { /* ... */ }
```
첫번째 코드는 함수의 문장 표현이고, 두번째와 세번재 표현은 함수 표현식이라고 한다. 이 코드를 소개하기 전에 먼저 결론부터 이야기하자면, 
>타입스크립트에서는 함수 표현식을 사용하는 것이 좋다. 

그 이유는 아래와 같이 정리할 수 있다.
함수의 **매개변수, 반환값 전체를 함수 타입으로 선언**하여 함수 표현식에 재사용할 수 있다. 이 item은 정말 실용적이고 실전에 바로 적용해볼 수 있을 것 같아서 예시를 꼼꼼히 살펴봤다. 간단한 예제를 보자.
```ts
type DiceRollFn = (sides: number) => number;
const rollDice: DiceRollFn = sides => {/* ... */}
```
`DiceRollFn` 이라는 타입을 지정하고, 그 타입에 대하여 함수 표현식에 그대로 적용한다. 그럼 자동으로 타입 추론을 통하여 반환값과 인수에 대하여 타입이 정해진다.

더욱 강력한 예제를 보자.
```ts
type BinaryFn = (a: number, b: number) => number;
const add: BinaryFn = (a, b) => a + b;
const sub: BinaryFn = (a, b) => a - b;
const mul: BinaryFn = (a, b) => a * b;
```
함수 타입 선언을 이용하면 타입 구문을 적게 사용할 수 있을 뿐만 아니라, 함수 구현부가 분리되어 있어 로직이 분명하게 드러난다는 장점이 있다. 

또다른 예시를 보자.
웹 브라우저에서 `fetch` 함수를 통하여 응답 데이터를 추출한다고 가정해보자.
정상적으로 데이터를 받았을 때에는 `json` 형태의 데이터를 받겠지만, 올바르지 못한 데이터를 받았을 때는 `json`이 아닌, 오류 메시지를 담은 `rejected` 프로미스를 받게 될 것이다.
먼저, fetch를 타입 선언해 줄 파일을 `lib.dom.ts`에 작성하자.
```ts
declare function fetch(
 input: RequestInfo, init?: RequestInit
): Promise<Response>;
```

이를 이용하여 fetch 함수를 더욱 간결히 작성할 수 있습니다.
```ts
const checkedFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error('Request failed: ' + response.status);
  }
  return response;
}
```
함수 표현식을 이용하여, 함수 전체에 타입을 주었다. (`typeof fetch`) 이는 타입스크립트가 자동으로 `input` , `init`을 추론하게 해준다. 그리고 타입 구문은 반환값을 보장하며 `throw` 대신에 `return`을 사용하였을 경우 이에 대한 실수도 예방할 수 있도록 오류를 잡아 바로잡아준다.

결론적으로 **함수 표현식 전체 타입을 정의하는 것은** 코드를 간결하고 안전하게 적을 수 있는 방법이다. 타입 선언을 매개변수에 일일이 하기보다는 함수 전체의 타입 선언을 이용해보도록 하자.