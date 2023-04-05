## *아이템 13 타입과 인터페이스의 차이점 알기*

*타입스크립트에서 명명된 타입을 정의하는 방법은 두 가지가 있는데, 타입을 이용하거나 인터페이스를 이용하는 것이다.*

*대부분 타입을 사용하든 인터페이스를 사용하든 상관이 없다.*

*하지만 둘 사이 차이점을 알고 상황에 맞춰 적합한 방법을 사용해야한다.*

*인터페이스 선언과 타입 선언의 유사한 점에 대해 알아볼 것이다.*

*먼저, 인덱스 시그니처는 인터페이스와 타입 모두에서 사용할 수 있다.*

*또한 함수 타입도 마찬가지다.*

*아래 함수와 같이 단순한 경우 타입 별칭이 더 나을 것 같지만 함수 타입에 추가적인 속성이 있다면 어떤 것을 선택하든 별 차이가 없다.*

```jsx
type TDict = { [key: string]: string };

interface IDict {
    [key: string]: string;
}
```

```jsx
type TFn = (x: number) => string;

interface IFn {
    (x: number): string;
}

const toStrT: TFn = x => '';
const toStrI: IFn = x => '';
```

```jsx
type TFnWithProperties = {
    (x: number): number;
    prop: string;
}

interface IFnWithProperties {
    (x: number): Number;
    prop: string;
}
```

*타입 별칭과 인터페이스는 모두 제너릭이 가능하다.*

```jsx
type TPair<T> = {
    first: T;
    second: T;
}

interface IPair<T> {
    first: T;
    second: T;
}
```

*인터페이스의 경우, 타입을 확장할 수 있고, 타입은 인터페이스를 확장할 수 있다.*

*다만 인터페이스는 유니온 타입 같은 복잡한 타입을 확장하지는 못한다.*

*복잡한 타입을 확장하고 싶으면 타입과 &를 사용해야한다.*

```jsx
interface IStateWithPop extends TState {
    population: number;
}

type TStateWithPop = IState & { population: number; }
```

*클래스 구현 시에는 타입과 인터페이스 둘 다 사용 가능하다.*

```jsx
class StateT implements TState {
    name: string = '';
    capital: string = '';
}

class StateI implements IState {
    name: string = '';
    capital: string = '';
}
```

*아래부터는 타입과 인터페이스의 차이점들을 알아볼 것이다.*

*유니온 타입은 존재하지만 유니온 인터페이스라는 개념은 없다.*

```jsx
type AorB = 'a' | 'b';
```

*인터페이스는 타입을 확장할 수 있지만, 유니온은 할 수 없다.*

```jsx
type Input = {};
type Output = {};

interface VariableMap {
	[name: string]: Input | Output;
}
```

*유니온 타입에 name 속성을 붙인 타입을 만들 수도 있다.*

```jsx
type NamedVariable = (Input | Output) & { name: string; };
```

*type 키워드는 일반적으로 interface보다 쓰임새가 많다.*

*type 키워드는 유니온이 될 수도 있고, 매핑된 타입 또는 조건부 타입 같은 고급 기능에 활용되기도 한다.*

*튜플과 배열 타입도 type 키워드로 간결하게 표현할 수 있다.*

```jsx
type Pair = [number, number];
type StringList = string[];
type NamedNums = [string, ...number[]];
```

*인터페이스로도 튜플과 비슷하게 구현할 수는 있다.*

*하지만 아래와 같이 인터페이스로 튜플과 비슷하게 구현하면 튜플에서 사용할 수 있는 concat 같은 메서드를 사용할 수 없다.*

*따라서 튜플은 type 키워드로 구현하는 것이 낫다.*

```jsx
interface Tuple {
	0: number;
	1: number;
	length: 2;
}

const t: Tuple = [10, 20];
```

*반면 인터페이스는 타입에 없는 몇 가지 기능이 있다.*

*인터페이스는 보강이 가능하다.*

아래와 같이 속성을 *확장하는 것을 선언 병합이라고 한다.*

*선언 병합은 주로 타입 선언 파일에서 사용된다.*

```jsx
interface IState {
    name: string;
    capital: string;
}

interface IState {
    population: number;
}

const wyoming: IState {
    name: 'wyoming',
    capital: 'cheyenne',
    population: 500_000
};
```