## *아이템 3 코드 생성과 타입이 관계없음을 이해하기*

*타입스크립트 컴파일러가 수행하는 역할은 크게 두 가지이다.*

- *최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일(translate + compile)한다.*
- *코드의 타입 오류를 체크한다.*

*이 두 가지는 서로 완벽히 독립적으로 이루어진다.*

*즉, 타입스크립트가 자바스크립트로 변환될 때 코드 내의 타입에는 영향을 주지 않는다.*

***타입 오류가 있는 코드도 컴파일이 가능하다.***

*컴파일은 타입 체크와 독립적으로 동작하기 때문에 타입 오류가 있는 코드도 컴파일이 가능하다.*

*만약 오류가 있을 때 컴파일하지 않으려면, tsconfig.json에 noEmitOnError를 설정하거나 빌드 도구에 동일하게 적용하면 된다.*

***런타임에는 타입 체크가 불가능하다.***

*아래 코드에서 instanceof 체크는 런타임에 일어나지만, Rectangle은 타입이기 때문에 런타임 시점에 아무런 역할을 할 수 없다.*

*이때 shape 타입을 명확하게 하려면, 런타임에 타입 정보를 유지하는 방법이 필요하다.*

```jsx
interface Square {
    width: number;
}

interface Rectangle extends Square {
    height: number;
}

type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
    if (shape instanceof Rectangle) {
        return shape.width * shape.height;
    } else {
        return shape.width * shape.width;
    }
}
```

*런타임에 타입 정보를 유지하는 방법으로는 height 속성이 존재하는지 체크하는 방법이 있다.*

*속성 체크는 런타임에 접근 가능한 값에만 관련되지만, 타입 체커도 shape의 타입을 Rectangle로 보정해주기 때문에 오류가 사라진다.*

```jsx
interface Square {
    width: number;
}

interface Rectangle extends Square {
    height: number;
}

type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
    if ('height' in shape) {
        return shape.width * shape.height;
    } else {
        return shape.width * shape.width;
    }
}
```

*런타임에 타입 정보를 유지하는 또 다른 방법으로는 런타임에 접근 가능한 타입 정보를 명시적으로 저장하는 ‘태그’ 기법이 있다.*

*여기서 Shape 타입은 태그된 유니온(tagged union)의 한 예이다.*

*해당 기법을 이용하면 런타임에 타입 정보를 손쉽게 유지할 수 있다.*

```jsx
interface Square {
    kind: 'square';
    width: number;
}

interface Rectangle {
    kind: 'rectangle';
    height: number;
    width: number;
}

type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
    if (shape.kind === 'rectangle') {
        return shape.width * shape.height;
    } else {
        return shape.width * shape.width;
    }
}
```

*런타임에 타입 정보를 유지하는 또 다른 방법으로는 타입과 값을 둘 다 사용하는 기법도 있다.*

*이때 타입의 경우에는 런타임 접근이 불가하고, 값의 경우에는 런타임 접근이 가능하다.* 

*타입을 클래스로 만들면 되는데, Square와 Rectangle을 클래스로 만들면 오류를 해결할 수 있다.*

*인터페이스는 타입으로만 사용이 가능하지만, 클래스는 타입과 값으로 모두 사용이 가능하기 때문에 오류가 없다.*

*type Shape = Square | Rectangle 코드에서 Rectangle은 타입으로 참조되지만 shape instanceof Rectangle 부분에서는 값으로 참조된다.*

```jsx
class Square {
    constructor(public width: number) {}
}

class Rectangle extends Square {
    constructor(public width: number, public height: number) {
        super(width);
    }
}

type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
    if (shape instanceof Rectangle) {
        return shape.width * shape.height;
    } else {
        return shape.width * shape.width;
    }
}
```

***타입 연산은 런타임에 영향을 주지 않는다.***

*다음 코드는 string 또는 number 타입의 값을 항상 number로 정제하는 경우인데, 타입 체커를 통과하지만 잘못된 방법을 썼다.*

*해당 코드는 아래와 같이 자바스크립트로 변환된다.*

*자바스크립트로 변환된 코드를 보면 알다시피, 아무런 정제 과정이 없다.*

*as number는 타입 연산이고 런타임 동작에는 아무런 영향을 미치지 않는다.*

*값을 정제하기 위해서는 런타임의 타입을 체크하고 자바스크립트 연산을 통해서 변환을 수행해야한다.*

```jsx
function asNumber(val: number | string): number {
    return val as number;
}
```

```jsx
function asNumber(val) {
    return val;
}
```

```jsx
function asNumber(val: number | string): number {
    return typeof(val) === 'string' ? Number(val) : val;
}
```

***런타임 타입은 선언된 타입과 다를 수 있다.***

*타입스크립트는 일반적으로 실행되지 못하는 죽은(dead) 코드를 찾아내지만, 아래 코드의 경우 strict를 설정하더라도 찾아내지 못한다.*

*아래 코드에서 : boolean은 타입 선언문이다.*

*타입스크립트의 타입은 런타임에 제거된다.*

```jsx
function setLightSwitch(value: boolean) {
    switch(value) {
        case true:
            turnLightOn();
            break;
        case false:
            turnLightOff();
            break;
        default:
            console.log(`실행되지 않을까봐 걱정됩니다.`);
    }
}
```

*/light를 요청하면 그 결과로 LightApiResponse를 반환하라고 선언했지만, 보장하지 못한다.*

*lightSwitchValue가 실제로는 문자열이었다면 런타임에는 setLightSwitch 함수까지 전달될 것이다.*

*또는 배포된 후에 API가 변경되어 lightSwitchValue가 문자열이 되는 경우도 있을 것이다.*

```jsx
interface LightApiResponse {
    lightSwitchValue: boolean;
}

async function setLight() {
    const response = await fetch('/light');
    const result: LightApiResponse = await response.json();
    setLightSwitch(result.lightSwitchValue);
}
```

*타입스크립트에서는 런타임 타입과 선언된 타입이 맞지 않을 수 있다.*

*선언된 타입은 언제든지 달라질 수 있다.*

***타입스크립트 타입으로는 함수를 오버로드할 수 없다.***

*타입스크립트에서는 타입과 런타임의 동작이 무관하기 때문에 함수 오버로딩은 불가능하다.*

*아래 코드에서 두 함수는 중복된 표현이다.*

```jsx
function add(a: number, b: number) {
    return a + b;
}

function add(a: string, b: string) {
    return a + b;
}
```

*타입스크립트가 함수 오버로딩 기능을 지원하기는 하지만, 온전히 타입 수준에서만 동작한다.*

*하나의 함수에 대해서 여러 개의 선언문을 작성할 수 있지만, 구현체는 오직 하나뿐이다.*

*add에 대한 처음 두 선언문은 타입 정보를 제공할 뿐이다.*

*해당 선언문들은 타입스크립트가 자바스크립트로 변환되면서 제거되고, 구현체만 남게 된다.*

```jsx
function add(a: number, b: number): number;
function add(a: string, b: string): string;

function add(a, b) {
    return a + b;
}

const three = add(1, 2);
const twelve = add('1', '2');
```

***타입스크립트 타입은 런타임 성능에 영향을 주지 않는다.***

*타입과 타입 연산자는 자바스크립트 변환 시점에 제거되기 때문에 런타임의 성능에 아무런 영향을 주지 않는다.*

*타입스크립트 컴파일러는 런타임 오버헤드가 없는 대신 빌드타임 오버헤드가 있다.*

*오버헤드가 커지면 빌드 도구에서 트랜스파일만(transpile only)를 설정해서 타입 체크를 건너뛸 수 있다.*

*타입스크립트가 컴파일하는 코드는 오래된 런타임 환경을 지원하기 위해서 호환성을 높이고 성능 오버헤드를 감안할지, 호환성을 포기하고 성능 중심의 네이티브 구현체를 선택할지의 문제에 맞닥뜨릴 수 있다.*