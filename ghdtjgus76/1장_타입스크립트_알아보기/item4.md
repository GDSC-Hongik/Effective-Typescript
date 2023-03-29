## *아이템 4 구조적 타이핑에 익숙해지기*

*타입스크립트는 자바스크립트와 같이 매개 변수 값이 요구 사항을 만족한다면 타입이 무엇인지 신경 쓰지 않는 동작을 그대로 모델링하는 덕 타이핑 기반이다.*

*아래 코드에서 NamedVector는 number 타입의 x와 y 속성이 존재하기 때문에 calculateLength 함수로 호출이 가능하다.*

*NamedVector의 구조가 Vector2D와 호환되기 때문에 calculateLength 호출이 가능한 것이다.*

```tsx
interface Vector2D {
    x: number;
    y: number;
}

interface NamedVector {
    name: string;
    x: number;
    y: number;
}

function calculateLength(v: Vector2D) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

const v: NamedVector = { x: 3, y: 4, name: 'Zee' };
calculateLength(v);
```

*다음 코드에서는 문제가 발생한다.*

*calculateLength는 2D 벡터를 기반으로 연산하는데, 버그로 인해서 normalize가 3D 벡터로 연산되었다.*

*z가 정규화에서 무시된 것이다.*

*하지만, 타입 체커는 이 문제를 잡아내지 못한다.*

*Vector3D와 호환되는 {x, y, z} 객체로 calculateLength를 호출하면, 구조적 타이핑 관점에서 x와 y가 있어서 Vector2D와 호환된다.*

*이 때문에 오류는 발생하지 않고 타입 체커가 문제로 인식하지 않았다.*

```jsx
interface Vector2D {
    x: number;
    y: number;
}

interface NamedVector {
    name: string;
    x: number;
    y: number;
}

interface Vector3D {
    x: number;
    y: number;
    z: number;
}

function calculateLength(v: Vector2D) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function normalize(v: Vector3D) {
    const length = calculateLength(v);

    return {
        x: v.x / length,
        y: v.y / length,
        z: v.z / length,
    }
}

const v: NamedVector = { x: 3, y: 4, name: 'Zee' };
calculateLength(v);
```

*함수 작성 시, 호출에 사용되는 매개변수의 속성들이 매개변수의 타입에 선언된 속성만을 가질 것이라 생각하지 쉽지만, 이런 타입은 봉인된(sealed), 또는 정확한(precise) 타입이라고 불리고, 타입스크립트의 타입 시스템에서는 표현할 수 없다.*

*타입은 확장에 열려 있다.*

*아래처럼 코드를 작성하게 되면 오류가 발생한다.*

*v는 어떤 속성이든 가질 수 있기 때문에 axis 타입은 string이 될 수도 있다.*

*타입스크립트는 v[axis]가 number라고 확정할 수 없다.*

*이 경우에서는 루프보다는 모든 속성을 각각 더하는 구현이 더 낫다.*

```jsx
function calculateLengthL1(v: Vector3D) {
    let length = 0;

    for (const axis of Object.keys(v)) {
        const coord = v[axis];  // 'string'은 'Vector3D'의 인덱스로 사용할 수 없기에 엘리먼트는 암시적으로 'any' 타입입니다.

        length += Math.abs(coord);
    }

    return length;
}

const vec3D = {x: 3, y: 4, z: 1, address: '123 Broadway'};
calculateLengthL1(vec3D);  // NaN 반환
```

```jsx
function calculateLengthL1(v: Vector3D) {
	return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);
}
```

*아래 코드에서 d는 string 타입의 foo 속성을 가진다.*

*또한, 하나의 매개변수로 호출이 되는 생성자를 가지기 때문에, 구조적으로는 필요한 속성과 생성자가 존재하기 때문에 문제가 없다.*

*만약 C의 생성자에 단순 할당이 아니라 연산 로직이 존재한다면 d에서는 생성자를 실행하지 않기 때문에 문제가 발생한다.*

```jsx
class C {
    foo: string;

    constructor(foo: string) {
        this.foo = foo;
    }
}

const c = new C('instance of C');
const d: C = { foo: 'object literal' };
```

*테스트 작성 시에는 구조적 타이핑이 유리하다.*

*getAuthors 함수를 테스트할 때는 구조적 타이핑을 활용해서 더 구체적인 인터페이스를 정의하는 것이 더 나은 방법이다.*

*타입스크립트는 테스트 DB가 해당 인터페이스를 충족하는지 확인한다.*

```jsx
interface Author {
    first: string;
    last: string;
}

//function getAuthors(database: PostgresDB): Author[] { 
//    const authorRows = database.runQuery(`SELECT FIRST, LAST FROM AUTHORS`);
//    return authorRows.map(row => ({ first: row[0], last: row[1] }));
//}

interface DB {
    runQuery: (sql: string): any[];
}

function getAuthors(database: DB): Author[] {
    const authorRows = database.runQuery(`SELECT FIRST, LAST FROM AUTHORS`);
    return authorRows.map(row => ({ first: row[0], last: row[1] }));
}
```