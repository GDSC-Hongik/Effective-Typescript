## *아이템 23 한꺼번에 객체 생성하기*

*객체를 생성할 때는 속성을 하나씩 추가하기보다는 여러 속성을 포함해서 한꺼번에 생성해야 타입 추론에 유리하다.*

*아래 코드는 자바스크립트에서는 오류가 나지 않는 반면, 타입스크립트에서는 오류가 난다.*

*이는 pt 타입은 {} 값을 기준으로 추론되기 때문에 존재하지 않는 속성을 추가할 수 없다.*

```jsx
const pt = {};

pt.x = 3;
pt.y = 4;
```

```jsx
const pt = {};

pt.x = 3;
// ~ '{}' 형식에 'x' 속성이 없다.
pt.y = 4;
// ~ '{}' 형식에 'y' 속성이 없다.
```

*아래 코드에서도 에러가 발생하는데, 이 문제들은 객체를 한 번에 정의하면 해결되는 문제이다.*

```jsx
interface Point {
    x: number;
    y: number;
}

const pt: Point = {};
// ~ '{}' 형식에 'Point' 형식의 x, y 속성이 없다.

pt.x = 3;
pt.y = 4;
```

*객체를 반드시 나눠서 만들어야 한다면, 타입 단언문(as)를 사용해서 타입 체커를 통과하게 할 수 있다.*

*하지만, 선언 시에 객체를 한꺼번에 만드는 게 더 좋다.*

```jsx
interface Point {
    x: number;
    y: number;
}

const pt = {} as Point;

pt.x = 3;
pt.y = 4;
```

*여러 객체를 합쳐 새 객체를 만드는 경우 객체 전개 연산자인 …를 사용하면 된다.*

*이 방법은 객체에 속성을 추가하고 타입스크립트가 새로운 타입을 추론할 수 있게 해서 유용하다.*

```jsx
const pt = { x: 3, y: 4 };
const id = { name: 'Pythagoras' };

const namedPoint = { ...pt, ...id };
namedPoint.name;  // 타입이 string
```

```jsx
const pt0 = {};
const pt1 = { ...pt0, x: 3 };
const pt: Point = { ...pt1, y: 4 };
```

*타입에 안전한 방식으로 조건부 속성을 추가하기 위해서는, 속성을 추가하지 않는 null 또는 {}으로 객체 전개를 사용하면 된다.*

*아래와 같이 표현하면 타입이 선택적 속성을 가진 것으로 추론된다는 것을 알 수 있다.*

```jsx
declare let hasMiddle: boolean;

const firstLast = { first: 'Harry', last: 'Truman' };
const president = { ...firstLast, ...(hasMiddle ? { middle: 'S'} : {})};
```

```jsx
const president: {
	middle?: string;
	first: string;
	last: string;
}
```

*아래와 같이 표현하면, start와 end가 선택적 필드가 아니라 유니온 타입으로 나타난다.*

*이 경우 start와 end가 함께 정의된다.*

*이런 관점에서 유니온을 사용하는 게 가능한 값의 집합을 더 정확히 표현할 수 있다.*

```jsx
declare let hasDates: boolean;

const nameTitle = { name: 'Khufu', title: 'Pharaoh' };
const pharaoh = {
    ...nameTitle,
    ...(hasDates ? { start: -2589, end: -2566 } : {})
}
```

```jsx
const pharaoh = {
	start: number;
	end: number;
	name: string;
	title: string;
} | {
	name: string;
	title: string;
}
```

```jsx
pharaoh.start
// ~ '{ name: string; title: string; }' 형식에 
// 'start' 속성이 없다.
```

*하지만, 관리 측면에서는 유니온보다 선택적 필드가 다루기 쉬울 수 있는데, 선택적 필드 방식으로 표현하려면 헬퍼 함수를 사용하면 된다.*

```jsx
function addOptional<T extends object, U extends object>(a: T, b: U | null): T & Partial<U> {
    return {...a, ...b};
}

const pharaoh = addOptional(nameTitle, hasDates ? { start: -2589, end: -2566 } : null);

pharaoh.start;  // 타입이 number | undefined
```