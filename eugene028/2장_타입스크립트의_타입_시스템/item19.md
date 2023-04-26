
# item19

타입스크립트를 처음 공부하였을 때 착각한 것이 한 가지 있다.
바로 모든 변수에 타입을 지정해줘야 하는 것이 아닌가??라는 것..
사실은 타입스크립트도 어느정도의 타입에 대하여 추론을 진행할 수 있다.
그렇기 때문에 아래 코드와 같이 작성을 하여도,
```ts
let x: number = 12;
```
다음과 같이 작성하여도 충분하다.
```ts
let x = 12;
```
타입 추론이 된다면, 명시적 타입 구문은 필요하지 않다. 
```ts
const person: {
  name: string;
  born: {
    where: string;
    when: string;
  };
  died: {
    where: string;
    when: string;
  }
} = {
  name: 'Sojourner Truth',
  born: {
    where: 'Swartekill NY',
    when: 'c.1797'
  },
  died: {
    where: 'Battle Creek, MI',
    when: 'Nov. 26, 1883'
  }
};
```
굳이 이렇게 작성하지 않아도 되고 변수에 바로 객체 리터럴을 적용해도 된다는 것이다. 배열의 경우도, 객체와 마찬가지이다. 
타입 추론을 통하여 얻을 수 있는 몇가지 이득들에 대해서 정리해 보고자 한다.
# 1. 타입이 추론되면 리팩토링이 용이하다.
```ts
inerface Product {
  id: number;
  name: string;
  price: number;
}
function logProduct(product: Product){
  const id: number = product.id;
  const name: string = product.name;
  const price: number= product.price;
  console.log(id, name, price);
}
```
`id`에 문자도 들어 있을 수 있음을 알게 되어서 타입을 수정하고자 한다면, 오류가 발생한다.
```ts
interface Product {
  id: string;
  name: string;
  price: number;
}
function logProduct(product: Product) {
  const id: number = product.id;
  const name: string = product.name;
  const price: number = product.price;
  console.log(id, name, price);
}
```
이러한 오류는 `logProduct` 함수 내에서 명시적 타입 구문이 존재하기 때문이다. 이럴 경우에는 타입에 대한 추론은 타입스크립트에게 그 역할을 남겨주는 것을 추천한다.
```ts
function logProduct(product: Product) {
  const {id, name, price} = product;
  console.log(id, name, price);
}
```
비구조화 할당문을 통하여 모든 지역 변수의 타입이 추론되는 것이다.
이 때, `product` 같은 것은 타입스크립트가 스스로 타입을 판단하기 힘들 수 있다. 그래서 함수에서 `Product` 타입을 명시적으로 지정해 준 것 이 그 이유이다.
이상적으로는 타입스크립트 함수/메서드 시그니처에도 타입 구문을 포함하는 것이 맞다고 생각이 든다. 그러나, **함수 내에서 생성된 지역 변수에는 타입 구문을 넣지 않아야 깔끔한 코드를 작성할 수 있다.**

# 2. 타입 추론이 가능해도, 타입을 명시하고 싶은 경우
## 객체 리터럴을 정의할 때
```ts
const elmo: Product = {
  name: 'Tickle Me Elmo',
  id: '048188 627152',
  price: 28.99,
};
```
객체 리터럴에 타입을 명시하게 되면 **잉여 속성 체크**가 일어난다. 잉여 속성 체크를 통하여 아래 오류들을 바로잡을 수 있는데,
1. 선택적 속성이 있는 타입의 오타 같은 오류를 잡는 데 효과적이다.
2. 변수가 사용되는 순간이 아닌, 할당하는 시점에 오류를 발생시킨다.
만약 타입 구문을 제거한다면 잉여 속성 체크가 동작하지 않고, 객체를 사용하는 곳에서 타입 오류가 발생한다.

그리고 오류가 발생하게 된다면 어디에서 오류가 발생하였는지 명시해주기도 한다.

## 함수의 반환
```ts
function getQuote(ticker: string){
  return fetch(`https://quotes.example.com/?q=${ticker}`).then(response => response.json());
}
```
함수의 반환에서, 추론이 가능할지라도 구현상의 오류가 함수를 호출한 곳 까지 영향을 미치게 하지 않기 위하여 타입 구문을 명시하는 것이 좋다.
```ts
const cache: {[ticket: string]: number} = {};
function getQuote(ticker: string){
  if (ticker in cache) {
    return cache[ticket];
  }
  return fetch(`https://quotes.example.com/?q=${ticker}`).then(response => response.json()).then(quote => {
    cache[ticker] = quote;
    return quote;
  })
}
```
`getQuote`는 항상 Promise를 반환하므로, `cache[ticket]`이 아니라, `Promise.resolve(cache[ticker])`가 반환되도록 해야 한다. 그래서 함수를 실행시키면 오류는 `getQuote` 내부가 아니라, 이를 호출한 코드에서 발생한다.

그러나 함수의 리턴값을 지정하면 정확한 위치에 오류가 발생하게 된다.
이렇게 함수의 반환을 지정하면 어떤 점이 이득이 있을까?
### 1. 함수에 대하여 명확하게 알 수 있다.
함수의 시그니처에 대하여 미리 작성을 하게 되면 구현에 맞추어 주먹구구식으로 시그니처가 작성되는 것을 방지할 수 있고, 제대로 원하는 함수의 모양을 만들어낼 수 있다.

### 2. 명명된 타입을 사용할 수 있다.
```ts
interface Vector2D { x: number; y: number; }
function add(a: Vector2D, b: Vector2D) {
  return { x: a.x + b.x, y: a.y + b.y };
};
```
타입스크립트는 반환 타입을 `{ x: number, y: number }`로 추론한다. 이는 `Vector2D`와 호환되지만, 그것을 의도한 것이 아니기 때문에 당황스러운 상황이 발생할 수 있습니다. 
반환 타입을 명시하면 더욱 직관적인 표현이 된다.