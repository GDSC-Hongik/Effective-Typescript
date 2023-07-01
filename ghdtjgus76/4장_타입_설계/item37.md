## 아이템 37 공식 명칭에는 상표를 붙이기

아래 코드를 한 번 보자.

```tsx
interface Vector2D {
    x: number;
    y: number;
}

function calculateNorm(p: Vector2D) {
    return Math.sqrt(p.x * p.x + p.y * p.y);
}

calculateNorm({ x: 3, y: 4 });

const vec3D = { x: 3, y: 4, z: 1 };
calculateNorm(vec3D);
```

해당 코드는 구조적 타이핑 관점에서는 문제가 없지만, 2차원 벡터를 사용해야 이치에 맞다.

calculateNorm 함수가 3차원 벡터를 허용하지 않게 하려면 공식 명칭을 사용하면 된다.

공식 명칭을 사용하는 것은 타입이 아니라 값의 관점에서 Vector2D라고 말하는 것이다.

아래와 같이 나타내면 위 문제가 해결된다.

```tsx
interface Vector2D {
    _brand: '2d';
    x: number;
    y: number;
}

function vec2D(x: number, y: number): Vector2D {
    return {x, y, _brand: '2d'};
}

function calculateNorm(p: Vector2D) {
    return Math.sqrt(p.x * p.x + p.y * p.y);
}

calculateNorm(vec2D(3, 4));

const vec3D = { x: 3, y: 4, z: 1 };
calculateNorm(vec3D);
// ~ 'brand' 속성이 ... 형식에 없다.
```

 상표(_brand)를 사용해서 calculateNorm 함수가 Vector2D 타입만 받는 것을 보장한다.

하지만, vec3D 값에 _brand: ‘2d’라고 추가하는 것과 같은 사용은 막을 수 없다.

상표 기법은 타입 시스템에서 동작하지만 런타임에 상표를 검사하는 것과 동일한 효과를 얻을 수 있다.

타입 시스템이기떄문에 런타임 오버헤드를 없앨 수 있고, 추가 속성을 붙일 수 없는 string이나 number 같은 내장 타입도 상표화할 수 있다.

아래 예를 한 번 보자.

런타임에는 절대 경로(’/’)로 시작하는지 체크하기 쉽지만, 타입 시스템에서는 절대 경로를 판단하기 어렵기 때문에 상표 기법을 사용한다.  

```jsx
type AbsolutePath = string & { _brand: 'abs' };

function listAbsolutePath(path: AbsolutePath) {
    // ...
}

function isAbsolutePath(path: string): path is AbsolutePath {
    return path.startsWith('/');
}
```

```tsx
function f(path: string) {
    if (isAbsolutePath(path)) {
        listAbsolutePath(path);
    }

    listAbsolutePath(path);
    // ~'string' 형식의 인수는 'AbsolutePath' 형식의
    // 매개변수에 할당될 수 없다.
}
```

만약 path 값이 절대 경로와 상대 경로 둘 다 될 수 있다면, 타입을 정제해주는 타입 가드를 사용해서 오류를 방지할 수 있다.

위와 같이 로직을 분기하는 것 대신 오류가 발생한 곳에 path as AbsolutePath를 사용해서 오류를 제거할 수도 있지만 단언문은 사용하지 않는 것이 좋다.

단언문을 쓰지 않고 AbsolutePath 타입을 얻기 위한 유일한 방법은 AbsolutePath 타입을 매개변수로 받거나 타입이 맞는지 체크하는 것뿐이다.

상표 기법은 타입 시스템 내에서 표현할 수 없는 수많은 속성들을 모델링하는데 사용되기도 한다.

아래 예시는 목록에서 한 요소를 찾기 위해 이진 검색을 하는 경우이다.

```jsx
function binarySearch<T>(xs: T[], x: T): boolean {
    let low = 0, height = xs.length - 1;

    while (high >= low) {
        const mid = low + Math.floor((high - low) / 2);
        const v = xs[mid];

        if (v == x) return true;
        [low, high] = x > v ? [mid + 1, high] : [low, mid - 1];
    }

    return false;
}
```

이진 검색은 이미 정렬된 상태를 가정하기 떄문에 목록이 이미 정렬된 경우는 문제가 없다.

목록이 정렬되어 있지 않은 경우 잘못된 결과가 나온다.

아래처럼 상표 기법을 사용해보자.

```jsx
type SortedList<T> = T[] & {_brand: 'sorted'};

function isSorted<T>(xs: T[]): xs is SortedList<T> {
    for (let i = 1; i < xs.length; i++) {
        if (xs[i] < xs[i - 1]) {
            return false;
        }
    }

    return true;
}

function binarySearch<T>(xs: SortedList<T>, x: T): boolean {
    // ... 
}
```

binarySearch를 호출하려면 정렬되었다는 상표가 붙은 SortedList 타입의 값을 사용하거나 isSorted를 호출해서 정렬되었음을 증명해야 한다.

앞의 예제는 객체의 메서드를 호출하는 경우 null이 아닌 객체를 받거나 조건문을 사용해서 해당 객체가 null이 아닌지 체크하는 코드와 동일한 형태이다.

또한, number 타입에도 상표를 붙일 수 있다.

```jsx
type Meters = number & {_brand: 'meters'};
type Seconds = number & {_brand: 'seconds'};

const meters = (m: number) => m as Meters;
const seconds = (s: number) => s as Seconds;

const oneKm = meters(1000);  // 타입이 Meters
const oneMin = seconds(60);  // 타입이 Seconds
```

하지만, number 타입에 상표를 붙여도 산술 연산 후에는 상표가 없어져 실제로 사용하기에는 무리가 있다.

```jsx
const tenKm = oneKm * 10;  // 타입이 number
const v = oneKm / oneMin;  // 타입이 number
```

코드에 여러 단위가 혼합된 많은 수의 숫자가 들어 있는 경우 숫자의 단위를 문서화하는 괜찮은 방법일 수 있다.

요약해서 말하자면 다음과 같다.

타입스크립트는 구조적 타이핑을 사용해서 값을 세밀하게 구분하지 못하는 경우가 있다. 

값을 구분하기 위해 공식 명칭이 필요하다면 상표를 붙이는 것을 고려해야 한다.

또한, 상표 기법은 타입 시스템에서 동작하지만 런타임에 상표를 검사하는 것과 동일한 효과를 얻을 수 있다.