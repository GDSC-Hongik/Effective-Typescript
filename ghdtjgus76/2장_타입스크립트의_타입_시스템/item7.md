## *아이템 7 타입이 값들의 집합이라고 생각하기*

*코드가 실행되기 전, 즉 타입스크립트가 오류를 체크하는 순간에는 타입을 가지고 있다.*

*null과 undefined의 경우 strictNullChecks 여부에 따라 number일 수도 있고 아닐 수도 있다.*

*가장 작은 집합은 아무 값도 포함하지 않는 공집합이고, 타입스크립트에서는 never 타입이다.*

*never 타입으로 선언된 변수의 범위는 공집합이기 때문에 아무런 값도 할당할 수 없다.*

*그 다음으로 작은 집합은 한 가지 값만 포함하는 타입이다.*

*이는 유닛 타입이라고 불리는 리터럴 타입이다.*

```jsx
type A = 'A';
type B = 'B';
type Twelve = 12;
```

*유니온 타입을 사용하면 여러 개를 묶을 수 있다.*

*이는 값들의 합집합을 나타낸다.*

```jsx
type AB = 'A' | 'B';
```

*타입스크립트 오류에서 ‘할당 가능한’이라는 문구는 집합의 관점에서 ‘~의 원소(값과 타입의 관계)’ 또는 ‘~의 부분 집합(두 타입의 관계)’를 의미한다.*

```jsx
const a: AB = 'A';  // 'A'는 집합 { 'A', 'B' }의 원소이다.
const c: AB = 'C';  // 'C' 형식은 'AB' 형식에 할당할 수 없다.
```

*타입 체커는 하나의 집합이 다른 집합의 부분 집합인지 검사한다.*

*어떤 객체가 string으로 할당 가능한 id 속성을 가지고 있으면 해당 객체는 Identified이다.*

*구조적 타이핑 규칙들은 어떠한 값이 다른 속성도 가질 수 있음을 의미한다.*

*게다가 함수 호출의 매개 변수에서도 다른 속성을 가질 수 있다.*

```jsx
interface Identified {
    id: string;
}
```

*& 연산자는 두 타입의 교집합을 계산한다.*

*타입 연산자는 인터페이스의 속성이 아닌, 타입의 범위에 적용된다.*

*또한, 추가적인 속성을 가지는 값도 그 타입에 속하기 때문에, 아래 코드에서 Person과 Lifespan을 둘 다 가지는 값은 인터섹션 타입에 속하게 된다.*

*또한, 해당 세 가지 속성보다 더 많은 속성을 가지는 값도 PersonSpan 타입에 속한다.*

```jsx
interface Person {
    name: string;
}

interface Lifespan {
    birth: Date;
    death?: Date;
}

type PersonSpan = Person & Lifespan;

const ps: PersonSpan = {
    name: 'Alan Turing',
    birth: new Date('1912/06/23'),
    death: new Date('1945/06/07')
};
```

*두 인터페이스의 유니온의 경우는 다르다.*

```jsx
type K = keyof (Person | Lifespan);  // 타입이 never
```

*정리하면 다음과 같다.*

```jsx
keyof (A&B) = (keyof A) | (keyof B)
keyof (A|B) = (keyof A) & (keyof B)
```

*조금 더 일반적으로 PersonSpan 타입을 선언하는 방법은 extends 키워드를 쓰는 것이다.*

*extends는 ‘~에 할당 가능한’과 비슷하게 ‘~의 부분 집합’이라는 의미로 받아들일 수 있다.*

*아래 코드에서 PersonSpan 타입의 모든 값은 문자열 name 속성과 birth 속성을 가져야한다.*

```jsx
interface Person {
    name: string;
}

interface PersonSpan extends Person {
    birth: Date;
    death?: Date;
}
```

*아래 코드에서는 Vector3D는 Vector2D의 서브 타입이고, Vector2D는 Vector1D의 서브 타입이다.*

```jsx
// extends 키워드 사용
interface Vector1D {
    x: number;
}

interface Vector2D extends Vector1D {
    y: number;
}

interface Vector3D extends Vector2D {
    z: number;
}
```

```jsx
// extends 키워드 사용 X
interface Vector1D {
	x: number;
}

interface Vector2D {
	x: number;
	y: number;
}

interface Vector3D {
	x: number;
	y: number;
	z: number;
}
```

*extends 키워드는 제너릭 타입에서 한정자로도 쓰인다.*

*이 코드에서는 상속의 관점이 아닌데, 집합의 관점에서 보면 이해하기 쉽다.*

*string의 부분 집합 범위를 가지는 어떠한 타입이라고 생각하면 된다.*

*해당 타입은 string 리터럴 타입, string 리터럴 타입의 유니온, string 자신을 포함한다.*

```jsx
function getKey<K extends string>(val: any, key: K) {
    // ... 
}
```

```tsx
interface Point {
    x: number;
    y: number;
}

type PointKeys = keyof Point;  // 타입은 'x' | 'y'

function sortBy<K extends keyof T, T>(vals: T[], key: K): T[] {
    // ... 
}

const pts: Point[] = [{ x: 1, y: 1 }, { x: 2, y: 0}];

sortBy(pts, 'x');  // 'x'는 'x'|'y'를 상속
sortBy(pts, Math.random() < 0.5 ? 'x' : 'y');  // 'x'|'y'는 'x'|'y'를 상속
```

*아래 코드에서 number[]는 [number, number]의 부분 집합이 아니기 때문에 할당할 수 없지만, 반대로는 동작한다.*

```jsx
const list = [1, 2];
const tuple: [number, number] = list;
// 'number[] 타입은 '[number, number]' 타입의 0, 1 속성에 없다.
```

*아래 코드에서는 오류가 발생한다.*

*타입스크립트는 숫자의 쌍을 {0: number, 1: number}로 모델링하지 않고, {0: number, 1: number, length: 2}로 모델링한다.*

*length 값이 맞지 않아 할당문에 오류가 발생했다.*

```tsx
const triple: [number, number, number] = [1, 2, 3];
const double: [number, number] = triple;
// '[number, number, number]' 형식은 '[number, number]' 형식에 할당할 수 없다.
// 'length' 속성의 형식이 호환되지 않는다.
// '3' 형식은 '2' 형식에 할당할 수 없다.
```

*Exclude 키워드를 사용하면 일부 타입을 제외할 수는 있지만, 결과가 적절한 타입스크립트 타입일 때만 유효하다.*

```jsx
type T: Exclude<string|Date, string|number>;  // 타입은 Date
type NonZeroNums = Exclude<number, 0>;  // 타입은 여전히 number
```