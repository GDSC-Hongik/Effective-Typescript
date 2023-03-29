# item3: 코드 생성과 타입이 관계없음을 이해하기
타입스크립트 컴파일러는 두 가지 역할을 수행한다.

>1. 최신 타입스크립트/자바스크립트 브라우저에서 동작할 수 있도록 구버전 자바스크립트로 트랜스파일함.
2. 코드의 타입 오류를 체크함.

1, 2번의 동작은 독립적이다.
타입스크립트가 자바스크립트로 변환될 때, 코드 내의 타입에는 영향을 주지 않고, 자바스크립트의 실행 시점에도 타입은 영향을 미치지 않는다.
그럼 이런 타입스크립트 컴파일러의 성질을 곱씹어 보면, 타입스크립트가 하는 일에 대하여 알 수 있다.

## 타입 오류가 있는 코드도 컴파일이 가능하다
>컴파일은 타입 체크와 **독립적**으로 작동한다.

그래서 타입 오류가 있는 코드도, 컴파일이 가능한 것이다.
컴파일을 통한 코드 생성이 완료되고 나서, 타입 체크 과정에서 오류를 발생시키기 때문이다. 독립적으로 작동한다.
코드에 오류가 있을 때 "타입 체크에 문제가 있다" 라고 말해야 한다. 컴파일은 정상적으로 진행되었고, 타입 체크에서 문제가 생겼기 때문이다.

자칫 엉성하고 엉터리인 언어라고 생각할 수 있지만, 이 특성은 타입스크립트를 이용한 웹 애플리케이션 개발에 도움이 되는 기능이다. 문제 오류를 수정하지 않더라도 다른 기능을 먼저 테스트해볼 수 있기 때문이다.

## 런타임에는 타입 체크가 불가능하다.
타입스크립트의 타입은 제거가 가능하다. 그래서 자바스크립트로 컴파일되는 과정에서 **모든 인터페이스 타입과 타입 구문은 모두 제거된다.**

```js
interface Square {
  width: number;
}
interface Rectangle extends Square {
  height: number;
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    //'Rectangle'은 형식만 참조하지만, 여기서는 값으로 사용되고 있습니다.
    return shape.width * shape.height;
  } else {
    return shape.width * shape.width;
  }
}
```
위의 코드에서 에러가 발생한다. `instanceof` 체크는 런타임에 일어나지만, Rectangle은 타입이기 때문에, 런타임 시점에 아무것도 하지 못하기 때문입니다.
그럼 이와 같은 에러는 어떻게 해결할 수 있을까?

### 속성 존재 여부 체크
```js
function calculateArea(shape: Shape) {
  if('height' in shape) {
    shape;
    return shape.width * shape.height;
  } else {
    shape;
    return shape.width * shape.height;
  }
}
```
속성 체크는 런타임 시점에 일어나나, 타입 체커가 shape를 Rectangle로 지정해 줄 수 있어서 문제를 해결할 수 있다.

### 태그 기법
런타임에 접근 가능한 타입 정보를 명시적으로 저장한다.
```js
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
  if(shape.kind === 'rectangle') {
    shape;
    return shape.width * shape.height;
  }
  ...
```
이렇게 런타임 시점에 타입의 정보를 유지할 수 있도록 한다.

### 클래스 생성
```js
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
  if (shape instanceof Rectangle){
    shape;
    return shape.width * shape.height;
  }
  ...
```
이렇게 class를 작성하여 관리하면, 타입과 값을 모두 사용할 수 있다. 인터페이스는 타입으로만 사용 가능한 단점을 보완한 것이라 할 수 있다.

### 타입 연산은 런타임에 영향을 주지 않는다
타입 연산은 컴파일 이후 제거되기 때문에 런타임에 영향을 주지 못하는 것이다.
```js
function asNumber(val: number | string): number {
  return val as number;
}
```
타입 연산 부분은 런타임에 작동 안하기 때문에, val을 number 타입으로 정제하려는 노력은 말짱 도루묵이 될 것이다..
아래와 같이 수정해보자.
```js
function asNumber(val: number | string): number {
  return typeof(val) === 'string' ? Number(val) : val;
}
```
>런타임에 타입을 지정할 수 없으므로, 타입 정보 유지를 위한 별도의 방법을 생각하고 코드를 작성하자.

### 런타임 타입은 선언된 타입과 다를 수 있다.
```js
function setLightSwitch(value: boolean) {
  switch (value) {
    case true:
      turnLightOn();
      break;
    case false:
      turnLightOff();
      break;
    default:
      console.log("실행되나?");
  }
}
```
`: boolean`은 타입 선언문이다. 그렇기 때문에 런타임에 제거된다. 그래서 자바스크립트에서 해당 함수의 인자로 `"ON"`을 넘겨 준다면, 마지막 코드가 실행된다.
이렇게 내가 의도한 타입(선언한 타입)과 런타임의 타입이 맞지 않을 수 있다.
이런 코드는 타입이 달라져서 오는 혼란함을 증가시킬 수 있다.

>선언된 타입이 언제든지 달라질 수 있다.

라는 마음으로 코드를 혼동되지 않게 작성해야 한다.

### 타입스크립트 타입으로는 함수 오버로드 금지
```js
function add(a: number, b: number) { return a + b;}
function add(a: string, b: string) { return a + b;}
```
이렇게 작성하는 함수 오버로딩이 불가능하다.

### 타입스크립트 타입은 런타임 성능에 영향을 주지 않는다.
반복되는 이야기이지만, 타입과 타입 연산자는 자바스크립트 변환 시점에 모두 삭제된다. 그래서 런타임 성능에 아무런 영향을 미치지 않는다.