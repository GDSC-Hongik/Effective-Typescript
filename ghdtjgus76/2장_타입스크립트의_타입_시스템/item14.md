## *아이템 14 타입 연산과 제너릭 사용으로 반복 줄이기*

*아래 코드는 함수, 상수, 루프의 반복을 제거해 코드를 개선할 수 있다.*

```jsx
console.log(`Cylinder 1 x 1`, 
    'Surface area: ', 6.283185 * 1 * 1 + 6.283185 * 1 * 1, 
    `Volume: `, 3.14159 * 1 * 1 * 1
);

console.log(`Cylinder 1 x 2`,
    `Surface area: `, 6.283185 * 1 * 1 + 6.283185 * 2 * 1,
    `Volume: `, 3.14159 * 1 * 2 * 1
);

console.log(`Cylinder 2 x 1`,
    'Surface area: ', 6.283185 * 2 * 1 + 6.283185 * 2 * 1,
    'Volume: ', 3.14159 * 2 * 2 * 1
);
```

```jsx
const surfaceArea = (r, h) => 2 * Math.PI * r * (r+h);
const volume = (r, h) => Math.PI * r * r * h;

for (const [r, h] of [[1, 1], [1, 2], [2, 1]]) {
    console.log(`Cylinder ${r} x ${h}`
        `Surface area: ${surfaceArea(r, h)}`,
        `Volume: ${volumne(r, h)}`
    );
}
```

*타입에 이름을 붙여 반복을 줄일 수 있다.*

```jsx
function distance(a: { x: number, y: number }, b: { x: number, y: number }) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

interface Point2D {
    x: number;
    y: number;
}

function distance(a: Point2D, b: Point2D) {}
```

*함수가 같은 타입 시그니처를 공유하고 있는 경우 명명된 타입으로 분리해낼 수 있다*.

```jsx
function get(url: string, opts: Options): Promise<Response> {}
function post(url: string, opts: Options): Promise<Response> {}

type HTTPFunction = (url: string, opts: Options) => Promise<Response>;

const get: HTTPFunction = (url, opts) => {}
const post: HTTPFunction = (url, opts) => {}
```

*공통적인 속성을 가진 인터페이스의 경우, 확장을 통해 반복을 제거할 수 있다.*

```jsx
interface Person {
    firstName: string;
    lastName: string;
}

interface PersonWithBirthDate extends Person {
    birth: Date;
}
```

*두 인터페이스가 필드의 부분 집합을 공유한다면, 공통 필드만 골라서 기반 클래스로 분리해낼 수 있다.*

*또한, 이미 존재하는 타입을 확장하는 경우, 일반적이지는 않지만 인터섹션 연산자(&)를 쓸 수도 있다.*

```jsx
type PersonWithBirthDate = Person & { birth: Date; };
```

*아래 코드의 경우 TopNavState를 확장해서 State를 구성하는것보다 State의 부분 집합으로 TopNavState를 정의하는 것이 바람직해보인다.*

*해당 방법을 사용하면 전체 앱의 상태를 하나의 인터페이스로 유지할 수 있게 해준다.*

*State 내 속성의 타입이 바뀌면 TopNavState에도 반영된다.*

*아직 중복된 코드가 있어 ‘매핑된 타입’을 사용하면 더 나아진다.*

*매핑된 타입은 배열의 필드를 루프 도는 것과 같은 방식이다.*

```jsx
 interface State {
    userId: string;
    pageTitle: string;
    recentFiles: string[];
    pageContents: string;
}

interface TopNavState {
    useId: string;
    pageTitle: string;
    recentFiles: string[];
}
```

```jsx
type TopNavState = {
	userId: State['userId'];
	pageTitle: State['pageTitle'];
	recentFiles: State['recentFiles'];
}
```

```jsx
type TopNavState = {
	[k in 'userId' | 'pageTitle' | 'recentFiles']: State[k];
}
```

*해당 패턴은 표준 라이브러리의 Pick과 같다.*

*Pick은 제너릭 타입이다.*

```jsx
type Pick<T, K extends keyof T> = { [k in K]: T[k]; } 
```

```jsx
type TopNavState = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;
```

*태그된 유니온에서도 중복이 발생할 수 있다.*

*Action 유니온을 인덱싱하면 타입 반복 없이 ActionType을 정의할 수 있다.*

*ActionType은 Pick을 사용하여 얻게 되는 type 속성을 가진 인터페이스와는 다르다.*

```jsx
interface SaveAction {
	type: 'save'
}

interface LoadAction {
	type: 'load'
}

type Action = SaveAction | LoadAction;
type ActionType = 'save' | 'load';  // 타입의 반복
```

```jsx
type ActionType = Action['type'];  // 타입은 'save' | 'load'
```

```jsx
type ActionRec = Pick<Action, 'type'>;  // { type: 'save' | 'load' }
```

*생성 이후 업데이트가 되는 클래스 정의 시 update 메서드의 매개변수 타입은 생성자와 동일한 매개변수이면서 타입 대부분이 선택적 필드가 된다.*

```jsx
interface Options {
    width: number;
    height: number;
    color: string;
    label: string;
}

interface OptionsUpdate {
    width?: number;
    height?: number;
    color?: string;
    label?: string;
}

class UIWidget {
    constructor(init: Options) {}
    update(options: OptionsUpdate) {}
}
```

*매핑된 타입과 keyof를 사용하면 Options로부터 OptionsUpdate를 만들 수 있다.*

*이 패턴은 표준 라이브러리의 Partial이라는 이름으로 포함되어 있다.*

```jsx
type OptionsUpdate = { [k in keyof Options]?: Options[k]; }

type OptionsKeys = keyof Options;  // 타입이 'width' | 'height' | 'color' | 'label
```

```jsx
class UIWidget {
	constructor(init: Options) {}
	update(options: Partial<Options>) {}
}
```

*값의 형태에 해당하는 타입을 정의하고 싶은 경우, typeof를 사용하면 된다.*

*값으로부터 타입을 만들어낼 때는 선언 순서에 주의해야한다.*

*타입 정의를 먼저 하고 값이 그 타입에 할당 가능하다고 선언하는 것이 좋다.*

*이렇게 하면 타입이 더 명확해지고 예상하기 어려운 타입 변동을 방지할 수 있다.*

```jsx
const INIT_OPTIONS = {
    width: 640;
    height: 480;
    color: '#00FF00',
    label: 'VGA'
}

interface Options {
    width: number;
    height: number;
    color: string;
    label: string;
}

type Options = typeof INIT_OPTIONS;
```

*함수나 메서드의 반환 값에 명명된 타입을 만드는 경우도 있다.*

*이때는 조건부 타입이 필요하다.*

*표준 라이브러리에는 일반적 패턴의 제너릭 타입이 정의되어 있는데, ReturnType 제너릭이 정확히 들어맞는다.*

*ReturnType은 함수의 값인 getUserInfo가 아니라 함수의 타입인 typeof getUserInfo에 적용되었다.*

```jsx
function getUserInfo(userId: string) {
    return {
        userId,
        name,
        age,
        height,
        weight,
        favoriteColor
    }
};
// 추론된 반환 타입은 { userId: string; name: string; age: number; ... }
```

```jsx
type UserInfo = ReturnType<typeof getUserInfo>;
```

*제너릭 타입은 타입을 위한 함수와 같다.*

*함수에서 매개 변수로 매핑할 수 있는 값을 제한하기 위해 타입 시스템을 사용하는 것처럼 제너릭 타입에서 매개변수를 제한할 수 있는 방법이 필요하다.*

*제너릭 타입에서 매개 변수를 제한할 수 있는 방법은 extends 키워드를 사용하는 것이다.*

*extends를 이용하면 제너릭 매개 변수가 특정 타입을 확장한다고 선언할 수 있다.*

*여기서 extends는 확장이 아니라 부분 집합의 의미이다.*

```jsx
interface Name {
    first: string;
    last: string;
}

type DancingDuo<T extends Name> = [T, T];

const couple1: DancingDuo<Name> = [
    { first: 'Fred', last: 'Astaire' },
    { first: 'Ginger', lase: 'Rogers' }
];

const couple2: DancingDuo<{ first: string }> = [
    {first: 'Sonny'},
    {first: 'Cher'}
]
// 'Name' 타입에 필요한 'last' 속성이
// '{ first: string; }' 타입에 없다.
```