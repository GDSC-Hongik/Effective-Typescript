# item13

명명된 타입을 선언할 때 개발자들이 가장 많이 하는 고민이지 않을까 싶다.
어떨 때 타입을 사용하고, 어떨 때 인터페이스를 사용해야 할까?
오늘 그 고민에 대한 정리를 책을 읽고 깨달은 점에 대하여 정리할 수 있었다.

```ts
type Tstate = {
  name: string;
  capital: string;
}
```
```ts
interface IState {
  name: string;
  capital: string;
}
```
이 두가지 차이를 명확하게 이해하고 어떤 상황에서 어떤 것을 써야 하는지 알아보도록 하자.

# 공통되는 속성
## 1. 추가 속성과 함께 할당하면 오류를 발생시킨다.
```ts
const wyoming: TState = {
  name: 'Wyoming',
  capital: 'Cheyenne',
  population:5 50000
};
// ..형식은 'TState' 형식에 할당할 수 없습니다. 개체 리터럴은 알려진 속성만 지정할 수 있으며, TState 형식에는 population이 없습니다.
```
## 2. 인덱스 시그니처를 인터페이스, 타입에서 모두 사용 가능하다.
```ts
type TDict = { [key: string]: string};
interface IDict {
  [key: string]: string;
}
```
## 3. 함수 타입을 인터페이스나 타입으로 지정할 수 있다.
```ts
type TFn = (x: number) => string;
interface IFn {
  (x: number) :string;
}
```
이렇게 간단한 경우에는 타입 별칭이 더 나을수도 있겠지만, 함수 타입에 추가적인 속성이 있다면 타입, 인터페이스 둘 중 아무거나 선택해도 된다.
```ts
type TFnWithProperties = {
  (x: number): number;
  prop: string;
}
interface IFnWithProperties {
  (x: number): number;
  prop: string;
}
```
## 4. 제너릭이 가능하다.
타입 별칭과 인터페이스는 모두 제너릭이 가능하다.
```ts
type TPair<T> = {
  first: T;
  second: T;
}
interface IPair<T> {
  first: T;
  second: T;
}
```
## 5. 클래스 구현 시 사용할 수 있다.
```ts
class StateT implements TState {
  name: string = '';
  capital: string = '';
}
```
```ts
class StateI implements IState {
  name: string = '';
  capital: string = '';
}
```

# 인터페이스만의 특성
## 1. 인터페이스는 타입을 확장할 수 있다.
보강 기능이 가능하다.
```ts
interface IState {
  name: string;
  capital: string;
}
interface IState {
  population: number;
}
const wyoming: IState = {
  name: 'Wyoming',
  capital: 'Cheyenne',
  population: 500_000
};
```
이렇게 속성을 확장하는 것은 **선언 병합**이라고 한다.
**타입 선언 파일**을 작성하게 될 때에는 선언 병합을 지원하기 위해 반드시 인터페이스를 사용하는데, 이는 나중에 더 자세히 배울 것이다.

### 타입 확장의 좋은 예시 - tsconfig
Array 인터페이스는 `lib.es5.d.ts`에 정의되어 있는데, 기본적으로는 해당 파일에 선언된 인터페이스가 사용된다. 만약에 `tsconfig.json`의 lib 목록에 ES2015를 추가하면 타입스크립트는 `lib.es2015.d.ts`에 선언된 인터페이스를 이용하는데, 이때 **병합**을 통하여 Array 인터페이스에 추가되는 것이다.
이렇게 각 선언이 병합되어 전체 메서드를 가진 Array타입을 얻게 되는 것이다.
이렇게 병합을 하고자 하면 인터페이스로 타입 선언 파일을 작성한다.

### 타입 확장의 예시 - api 타입 선언
백엔드와 소통하며 API는 언제든지 바뀔 수 있다. API에 대한 타입 선언을 인터페이스로 생성하는 것이 좋다. 새로운 필드를 개발자가 병합하여 개발하게 될 때 유용하게 대처할 수 있기 때문이다. 그러나 api를 제외하고 프로젝트 내부에 인터페이스를 무분별하게 사용하여 타입에 선언 병합이 일어나는 것은 좋지 못하므로 주의해야 한다. 

# 타입의 특성
## 1. 유니온 타입 사용
```ts
type Input = {/* ... */};
type Output = {/* ... */};
interface VariableMap {
  [name: string]: Input | Output;
}
```
`Input`과 `Output`은 별도의 타입이고, 이 둘을 하나의 변수명으로 매핑하기 위하여 유니온 타입을 이용하여 새로운 인터페이스를 만들 수 있다.
혹은 다음과 같이 표현할 수 있다.
```ts
type NamedVariable = (Input | Output) & {name: string}
```
type 키워드는 유니온이 될 수도 있고, 매핑된 타입 또는 조건부 타입 같은 고급 기능에 활용될 수 있다.

## 2. 튜플, 배열 간결한 표현
```ts
type Pair = [number, number];
type StringList = string[];
type NamedNums = [string, ...number[]];
```
인터페이스를 이용하여 튜플과 비슷하게 구현할 수 있다.
```ts
interface Tuple {
  0: number;
  1: number;
  length: 2;
}
```
그러나 이렇게 비슷하게 구현해도, 튜플에서 사용할 수 있는 `concat`과 같은 메서드를 사용할 수 없다. 그래서 튜플은 type로 구현하는 것이 낫다.