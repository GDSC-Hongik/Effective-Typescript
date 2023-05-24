# item54

아래 객체를 순회해야 한다고 상황을 가정해 보자.
```ts
cosnt obj = {
  one: 'uno',
  two: 'dos',
  three: 'tres',
};
for (const k in obj) {
  const v = obj[k]; //Error 발생!
}
```
첫 시도에서 보기 좋게 에러가 발생해버린다. 그 이유는 무엇일까?! 루프문에서 정의한 k의 타입은 `string`인 반면에 객체에는 `one`, `two`, `three`라는 세 개의 키만 존재하기 때문이다. 타입이 다르게 추론되었기 때문에 오류가 발생한 것이다. 
이럴 때는 k의 타입을 조금 더 명확하게 명시해 주면 오류가 사라진다.
```ts
let k: keyof typeof obj; //'one' | 'two' | 'three'
for (k in obj) {
  const v = obj[k] //정상
 }
```
> k의 타입이 객체의 키로 판단되지 않고 string으로 판단되는 이유는 무엇일까?

아래 예제를 확인해 보자.
```ts
interface ABC {
  a: string;
  b: string;
  c: number;
}
function foo(abc: ABC) {
  for (const k in abc) { //k는 string으로 추론
    const v = abc[k]; //v는 암시적으로 'any'가 됨
    ..
  }
}

const x = {a: 'a', b: 'b', c: 2, d: new Date()}
foo(x)
```
프로퍼티의 개수가 하나 더 늘어난 상황에서 구조적 타이핑에 의해서 정상적으로 `foo`함수가 호출된다.
만약, 아래와  같이  `foo` 함수가 판단한다고 가정해보자.
```ts
function foo(abc: ABC) {
  let k: keyof ABC; // let k: "a" | "b" | "c"
  for (k in abc) {
    const v = abc[k];
  }
}
```
k가 `'a' | 'b' | 'c'` 타입으로 **한정**되기 때문에, foo의 역할이 너무 좁아질 뿐 더러 `v`는 `string | number`로 한정이 되어 버린다. v는 Date 형식이 될 수도 있고, key는 d가 들어올 수도 있는데 이렇게 가다가는 예기치 못한 동작 결과를 발견하게 될 수 있다. 

## 해결 방법?
이럴 때는 `Object.entries`를 사용해서 루프를 돌아보자. <a href ="https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/entries">설명 자세히보기</a>

```ts
function foo(abc: ABC) {
  for (const [k,v] of Object.entries(abc) {
    k //string 타입
    v //any 타입
  }
}
```
### forEach 사용하기
```ts
Object.entries(obj).forEach(([key, value]) => {
console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
});
```
### Map 객체로 변환하기
```ts
const obj = { foo: 'bar', baz: 42 };
const map = new Map(Object.entries(obj));
console.log(map); // Map { foo: "bar", baz: 42 }
```
  