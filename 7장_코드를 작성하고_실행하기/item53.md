# item53
몰랐던 사실인데, 자바스크립트의 기능만을 이용하는 것이 아니라 타입스크립트 팀 내에서 독립적으로 개발했던 내장 기능들이 있었다고 한다.
하지만, 자바스크립트의 발전에 따라 신규 기능이 나오게 되면서, 타입스크립트 내에서 사용하는 기능과 호환성에 문제가 생기게 된 것이다. 이에 따라 타입스크립트 개발팀은 자바스크립트의 신규 기능을 그대로 채택하고, 타입스크립트 초기 버전과 호환성을 포기했다고..~~(그럼 개발했던 개발자들은...뭐가 되는걸까... 괴담같은 스토리🧟‍♂️)~~

이 때 이후로 타입스크립트 개발 팀은, **타입 기능만 발전**시키는 것과, **런타임 기능을 발전**시키는 것에 집중하여 일하고 있다고 한다.
하지만 이러한 원칙을 세워서 개발하기 전에 이미 사용되고 있던 자바스크립트와 혼동할 수 있는 기능들이 있어서, 이들의 사용을 **지양**하기 위하여 몇가지 정리해 둔 것이 있다. 아래 기능들을 타입스크립트 내에서 되도록 사용하지 말자!!

## 1. 열거형(enum)
타입스크립트에서도 아래와 같이 열거형을 사용할 수 있다.
```ts
enum Flavor {
  	VANILLA = 0,
  	CHOCOLATE = 1,
  	STARWBERRY = 2,
}
let flavor = Flavor.CHOCOLATE; //타입은 Flavor, flavor은 1
Flavor[0] //값이 "VANILLA"
```
하지만 주의해야 할 점은 아래와 같다.
- 숫자 열거형에 `0, 1, 2` 외의 다른 숫자가 할당되면 매우 위험하다.
- 상수 열거형은 보통의 열거형과 달리 런타임에 완전히 제거된다. 그렇기 때문에 `const enum Flavor`로 바꾸면, 컴파일러는 `flavor`를 0으로 바꿔버린다.
- `preserveConstEnums`플래그를 설정한 상수 열거형은 보통의 열거형 정보와 같이 런타임에 상수 열거형 정보를 유지한다.

### 문자형 열거형
문자열 열거형은 런타임의 타입 안전성와 투명성을 제공한다. 그러나, 타입스크립트의 다른 타입과 달리 구조적 타이핑이 아니라 **명목적 타이핑**을 사용한다.
```ts
enum Flavor {
  VANILLA = 'vanilla',
  CHOCOLATE = 'chocolate',
  STRAWBERRY = 'strawberry',
}
let flavor = Flavor.CHOCOLATE; 
flavor = 'strawberry' //ERORR!!!!
```
이렇게 구조적 타이핑을 허용하지 않는 모습을 볼 수 있다.
그리고 문제는 대표적으로 아래 예시에서 확인할 수 있다.
```ts
function scoop(flavor: Flavor) {/*...*/}
```
여기서 `Flavor`는 런타임 시점에 문자열로 판단된다. 자바스크립트에서는 아래 코드가 정상으로 판단된다.
```js
scoop('vanilla');
```
하지만 타입스크립트에서는 다르다. 열거형을 임포트한 이후 문자열 자리에 대힌 사용해야 한다.
```ts
scoop('vanilla'); //'vanilla'형식은 Flavor형식의 매개변수에 할당될 수 없습니다.
```
```ts
import {Flavor} from 'ice-cream';
scoop(Flavor.VANILLA);//정상
```
그렇기 때문에 **문자열 열거형은 타입스크립트에서 사용하지 않는** 것이 좋다. 열거형 대신 리터럴 타입의 유니온을 사용하도록 하자.
```ts
type Flavor = 'vanilla' | 'chocolate' | 'strawberry';
let flavor: Flavor = 'chocolate'; //정상
```
리터럴 타입의 유니온은 열거형만큼 안전하고, 자바스크립트와 호환도 되며, 자동완성 기능을 사용할 수 있다. 

## 2. 매개변수 속성
일반적으로 클래스를 초기화할 때, 속성을 할당하기 위하여 생성자의 매개변수를 사용해야 한다.
```ts
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
```
타입스크립트는 더욱 간결한 문법으로 작성할 수 있다.
```ts
class Person {
  constructor(public name: string){}
}
```
예제의 `public name`은 **매개변수 속성**이라고 불리고, 멤버 변수로 `name`을 선언한 이전 예제와 동일하게 동작한다. 그러나, 이렇게 간결하게 쓴 코드는 몇가지 문제가 존재한다. 그 중 가장 큰 문제는 바로 혼란스러운 코드 작성이다.
```ts
class Person {
  first: string;
  last: string;
  constructor(public name: string) {
    [this.first, this.last] = name.split(' ');
  }
}
```
Person 클래스에는 세 가지 속성이 존재하지만, 언뜻 보면 `first`와 `last`만 속성에 나열되어 있고, `name`은 매개변수 속성이라서 클래스 내의 속성으로 정의된 것처럼 보이지가 않는다. 만약 클래스에 **매개변수 속성만** 존재한다면, 클래스 대신에 **인터페이스**를 만들고, 객체 리터럴을 만드는 것을 추천한다.

## 3. 네임스페이스, 트리플 슬래시 임포트 지양
ESMAScript 2015 이후, 모듈이 새로 도입되었다. (import, export) 그렇기 때문에 타입스크립트 팀에서 자체 개발하였던 **트리플 슬래시**와 **네임스페이스 키워드**는 주력으로 사용하는 것을 지양하게 되었다.
```ts
namespace foo {
  funtion bar() {}
}

///<reference path="other.ts"/>
foo.bar();
```
이는 호환성을 위해 남겨진 유산일 뿐...

## 4. 데코레이터
데코레이터는 클래스, 메서드, 속성에 어노테이션을 붙이거나 기능을 추가하는 데 사용할 수 있다.(ex. 클래스의 메서드가 호출될 때마다 로그 남기려면 `@logged` 어노테이션 정의..) 이는 앵귤러 프레임워크를 지원하기 위해서 만들어진 것인데, 현재까지도 표준화 상태가 들쭉날쭉하다. 그래서 호환성이 깨질 가능성이 있으므로 타입스크립트에서 이는 되도록 사용하지 말자.