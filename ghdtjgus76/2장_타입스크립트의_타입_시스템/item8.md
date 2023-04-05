## *아이템 8 타입 공간과 값 공간의 심벌 구분하기*

*타입스크립트의 심벌은 타입 공간이나 값 공간 중 한 곳에 존재한다.*

*심벌은 이름이 같더라도 속하는 공간에 따라 다른 것을 나타낼 수 있다.*

*interface Cylinder에서 Cylinder는 타입으로 쓰인다.*

*const Cylinder에서 Cylinder와 이름은 같지만 값으로 쓰이고, 서로 아무 관련이 없다.*

*Cylinder는 상황에 따라 타입으로 쓰일 수도 있고, 값으로 쓰일 수도 있다.*

```jsx
interface Cylinder {
    radius: number;
    height: number;
}

const Cylinder = (radius: number, height: number) => ({ radius, height });
```

*아래 코드에서는 오류가 발생한다.*

*instanceof는 자바스크립트의 런타임 연산자이고, 값에 대해 연산을 한다.*

*따라서 instanceof Cylinder는 타입이 아니라 함수를 참조한다.*

```jsx
function calculateVolume(shape: unknown) {
    if (shape instanceof Cylinder) {
        shape.radius;
    }
}
```

*일반적으로 type이나 interface 다음에 나오는 심벌은 타입인 반면, const나 let 선언에 쓰이는 것은 값이다.*

*또한, 타입 선언(:) 또는 단언문(as) 다음에 나오는 심벌은 타입인 반면, = 다음에 나오는 모든 것은 값이다.*

*아래 코드에서 p와 { first: ‘Jane’, last: ‘Jacobs’ }는 값이지만, Person은 타입이다.*

```jsx
interface Person {
    first: string;
    last: string;
}

const p: Person = { first: 'Jane', last: 'Jacobs' };
```

*class와 enum의 경우 상황에 따라 타입과 값 두 가지 모두 가능한 예약어이다.*

*아래 코드에서 Cylinder 클래스는 타입으로 쓰였다.*

*클래스가 타입으로 쓰이는 경우 형태(속성과 메서드)가 사용되는 반면, 값으로 쓰일 때는 생성자가 사용된다.*

```jsx
class Cylinder {
    radius=1;
    height=1;
}

function calculateVolume(shape: unknown) {
    if (shape instanceof Cylinder) {
        shape.radius;
    }
}
```

*연산자 중에서도 타입에서 쓰일 때와 값에서 쓰일 때 다른 기능을 하는 것이 있는데, typeof가 그 예이다.*

*타입 관점에서 typeof는 값을 읽어서 타입스크립트 타입을 반환한다.*

*값의 관점에서 typeof는 자바스크립트 런타임의 typeof 연산자가 된다.*

*값 공간의 typeof는 대상 심벌의 런타임 타입을 가리키는 문자열을 반환하고, 타입스크립트 타입과는 다르다.*

```jsx
type T1 = typeof p;  // 타입은 Person
type T2 = typeof email;  // 타입은 (p: Person, subject: string, body: string) => Response

const v1 = typeof p;  // 값은 "object"
const v2 = typeof email;  // 값은 "function"
```

*class 키워드는 값과 타입 두 가지로 모두 사용이 가능하기 때문에 class에 대한 typeof는 상황에 따라 다르게 동작한다.*

*클래스는 자바스크립트에서는 실제 함수로 구현되기 때문에 첫 번째 줄의 값은 function이 된다.*

*두 번째 줄의 타입은 Cylinder가 인스턴스 타입이 아니라는 것을 나타낸다.*

*new 키워드를 사용할 때 볼 수 있는 생성자 함수이다.*

```tsx
const v = typeof Cylinder;  // 값이 "function"
type T = typeof Cylinder;  // 타입이 typeof Cylinder
```

*아래 코드처럼 InstanceType 제너릭을 사용해서 생성자 타입과 인스턴스 타입을 전환할 수 있다.*

```jsx
type C = InstanceType<typeof Cylinder>;  // 타입이 Cylinder
```

*속성 접근자인 []는 타입으로 쓰일 때 동일하게 동작하지만, obj[’field’]와 obj.field는 값이 동일해도 타입은 다를 수 있다.*

*타입의 속성을 얻을 때는 반드시 obj[’field’]를 사용해야한다.*

```jsx
const first: Person['first'] = p['first'];  
```

*인덱스 위치에는 유니온 타입과 기본형 타입을 포함한 어떠한 타입이든 사용 가능하다.*

```jsx
type PersonEl = Person['first' | 'last'];  // 타입은 string
type Tuple = [string, number, Date];
type TupleEl = Tuple[number];  // 타입은 string | number | Date
```

*두 공간 사이에서 다른 의미를 가지는 코드 패턴들이 있다.*

- *값으로 쓰이는 this는 자바스크립트의 this 키워드이다. 타입으로 쓰이는 this는 다형성 this라고 불리는 this의 타입스크립트 타입이다. 서브 클래스의 메서드 체인 구현 시 유용하다.*
- *값에서 &와 |는 AND와 OR 비트 연산이다. 타입에서는 인터섹션과 유니온이다.*
- *const는 새 변수를 선언하지만 as const는 리터럴 또는 리터럴 표현식의 추론된 타입을 바꾼다.*
- *extends는 서브 클래스 (class A extends B) 또는 서브 타입(interface A extends B) 또는 제너릭 타입의 한정자(Generic<T extends number>)를 정의할 수 있다.*
- *in은 루프 (for (key in object)) 또는 매핑된(mapped) 타입에 등장한다.*

 *자바스크립트에서 가능한 구조 분해 할당을 타입스크립트에서 하면 이상한 오류가 발생한다.*

*값의 관점에서 Person과 string이 해석되었기 때문에 오류가 발생했다.*

*이를 해결하기 위해서는 다음과 같이 타입과 값을 구분해야한다.*

```jsx
function email({ person: Person, subject: string, body: string }) {} 
```

```jsx
function email({ person, subject, body}: { person: Person, subject: string, body: string }) {}
```