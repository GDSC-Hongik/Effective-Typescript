# item50
이렇게 조건부 타입을 작성하는 것은 이번에 타입스크립트 책 읽으면서 처음 본 것이어서 나중에 꼭 써봐야 겠다는 마음으로 정리해본다.
만약 내가 이런 함수를 작성하고 싶다고 가정해보자.
```ts
function double(x) {
  return x + x;
}
```
double 함수에는 string 타입도 들어올 수 있고, number 타입의 매개변수가 들어올 수도 있다. 그래서 유니온 타입을 사용했다고 가정해보자.
```ts
function double(x: number|string): number|string;
function double(x: any) { return x + x }
```
이렇게 코드를 작성하게 되면 모호한 타입이 결정될 때가 있다.
```ts
const num = double(12) // string | number
const str = double('x')// string | number
```
틀린 건 아니지만, 뭔가 좀...간지가 안난다.
그럼 타입을 여러 개로 분리해 볼 수 있겠다
```ts
function double(x: number): number;
function double(x: string): string;
function double(x: any) { return x + x };

const num =. double(12); //타입이 number
const str = double('x'); //타입이 string
```
이렇게 각각의 타입을 넣는 것은 문제없이 작동하나, 유니온 타입에는 아직 오류가 존재한다.
```ts
function f(x: number|string){
  return double(x);
  //string|number 형식의 인수는 'string'형식의 매개변수에 할당 불가..
}
```
double 함수가 호출되면 오버로딩 타입 중에서 일치하는 타입이 있을 때까지 순차적인 검색을 진행한다. 오버로딩 타입인 string 까지 검사했을 때, string|number 타입은 string에 할당할 수 없기 때문에 오류가 발생한 것이다. 이럴 경우 조건부 타입을 이용하여 타입 공간에 if문을 만들어주는 효과를 줘보자.
```ts
function dobule<T extends number | string> (
 	x: T
): T extends string ? string: number;
function double(x: any) { return x + x };
```
이 코드는 삼항 연산자를 이용하여 타입을 검사한다.
1. T가 string의 부분 집합이면, 반환 타입을 string으로 결정
2. 그 외의 경우에는 반환 타입을 number로 지정

그럼 아까 발생했던 문제점도 아래와 같은 과정으로 검색을 진행한다.
```
(nubmer | string) extends string? string : number
-> (number extends string ? string : number ) | 
(string extends string ? string : number) 
-> number | string
```
타입 오버로딩이 필요한 경우 조건부 타입을 이용하여 유연하게 코드를 검토해보도록 하자. 지금까지 무지성 유니온 타입만 사용했었는데 이렇게 코드를 검토해 볼 수 있다는 점이 신기했다.
