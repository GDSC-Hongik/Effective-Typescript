# 추론 가능한 타임을 사용해 장황한 코드 방지하기

- 이상적으로 함수/메서드의 시그니쳐에는 타입 구문이 있지만 함수 내의 지역 변수에는 타입 구문이 없다

## 타입 추론을 사용하는 것이 더 좋은 상황

타입스크립트 초보자들이 흔히 저지르는 실수 중 하나는 무분별한 타입 구문의 추가이다.
타입스크립트에서는 (예를 들어) 단순한 숫자값을 변수에 담을 때 따로 타입을 정해 줄
필요 없이 타입 추론 기능을 사용하는 것이 더 생산적이다.

몇 가지 예를 살펴보자.

```ts
// x는 number 타입으로 추론됨
let x = 0;

// y는 0 리터럴 타입으로 추론됨
const y = 0;

// str은 "str" 리터럴 타입으로 추론됨
const str = "str";

// obj는 {
//     name: string;
//     food: string;
// } 타입으로 추론됨
const obj = {
  name: "John Cena",
  food: "🍦Bing Chilling🍦",
};

// name과 food 둘 다 string 타입으로 추론됨
const { name, food } = obj;

// howFun은 number 타입으로 추론됨
function happy(howHappy = 10) {
  console.log(`I am s${"o".repeat(howHappy)} happy!`);
}

// numbers는 number[] 타입으로 추론됨
const numbers = [5, 4, 3, 2, 1];

// a와 b 둘 다 number 타입으로 추론됨
numbers.sort((a, b) => a - b);
```

## 타입을 명시하는 것이 더 좋은 상황

타입스크립트에서 객체 리터럴을 정의할 때 타입 구문을 사용하면 타입 오류 발생 시 객체가
사용되는 순간이 아닌 할당되는 시점에 오류가 표시된다.

```ts
interface Person {
  name: string;
  age: number;
}

function printPerson({ name, age }: Person) {
  console.log(`name: ${name}, age: ${age}`);
}

const bob: Person = {
  name: "Bob",
  howOld: 20, // bob이 Person임을 선언하면 여기서 타입 에러 발생
};

// bob이 Person임을 선언하지 않으면 여기서 타입 에러 발생
printPerson(bob);
```

타입스크립트에서 함수를 정의할 때 반환 타입을 정의하면 구현상 오류가 있더라도 함수가
사용되는 곳까지 에러가 퍼지는 것을 방지할 수 있다.

```ts
function findAverage(...numbers: number[]): number {
  return "TODO"; // 에러 발생!
}

const team = {
  name: "*데 빅 휴먼",
  rankHistory: [8, 8, 8, 8, 5, 7, 7],
};

// averageRank는 findAverage 함수의 구현과 관계없이 number 타입으로 추론됨
const averageRank = findAverage(team.rankHistory);
```
