# item41
타입스크립트에서는 일반적으로 변수의 타입은 변수를 선언할 때 결정한다. 그 후, 정제되거나 변경되는 것은 어려우나, **any 타입과 관련해서는 예외인 경우가 존재**한다.
```ts
function range(start: number, limit: number) {
  const out = [];
  for (let i = start; i <limit; i++) {
    out.push(i);
  }
  return out;
}
```
`out` 타입은 처음에 암시적 any로 초기화되었는데, 반환 타입은 `number[]`로 등장한다. out의 타입은 any로 선언되었지만, number 타입의 값을 넣은 순간부터 타입이 **진화**한 것이다.
조건문에 따라서는 여러 값으로 진화할 수도 있다. 아래 코드를 보자.
```ts
const result = []; //타입이 any
result.push('a');
result //타입은 string[]
result.push(1);
result //타입은 (string|number)[]
```
any 타입의 진화는 `noImplicitAny`가 설정된 상태에서, 변수의 타입이 암시적으로 any인 경우에만 일어난다. 만약 **명시적으로 any를 선언하게 된다면 타입이 그대로 유지된다.**

만약, 암시적인 any 상태 변수로 둔 다음에 진화를 시키지도 않고, 단언을 시키지도 않는다면 오류가 발생한다.
```ts
function range(start: number, limit: number) {
  const out = [];
  if ( start === limit ) {
    return out;
  }
  for (let i = start ; i < limit ; i++) {
    out.push(i);
  }
  return out; //암시적 any를 반환하므로 오류 발생
}
```
any타입의 진화는 암시적 any타입에 어떤 값을 할당할 때만 발생한다. 그리고 어떤 변수가 암시적 any 상태일 때, 값을 읽으려고 하면 오류가 발생한다. 하지만, 주의해야 할 점이 있다.
```ts
function makeSquares(start: number, limit: number) {
  const out = [];
  range(start, limit).forEach(i => {
    out.push(i * i);
  });
  return out; //any[]로 판단, 오류 발생
}
```
여기서 숫자가 곱해진 값이 `out` 배열에 추가되기 때문에 반환값은 `number[]`로 추론될 것으로 보이나, `any[]` 형식으로 추론되어 반환되기 때문에 에러가 발생한다. 루프를 도는 함수를 호출하기보다는 `map`을 이용하여 배열을 생성하고 any 전체를 진화시키는 방법으로 생각해볼  수 있겠다.
