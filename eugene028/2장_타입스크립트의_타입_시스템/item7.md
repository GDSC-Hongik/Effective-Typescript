# item7: 타입이 값들의 집합이라고 생각하기
타입은 `할당 가능한 값들의 집합`이라고 생각해야 한다. 이러한 집합은 타입의 **범위**라고 부르기도 하는데, 범위에 대해서 타입을 생각해보자.
가장 먼저, 제일 작은 집합은 아무것도 포함하지 않는 **공집합**이다. 이는 타입스크립트에서 `never` 타입으로 사용되며, 이로 선언된 변수의 범위는 **공집합**의 타입을 가지기 때문에 아무런 값도 할당할 수 없다.

다음으로 작은 집합은 **한 가지 값만 포함하는 타입**이다. 이는 `유닛`타입이라고 불리는 **리터럴**타입이다.
```ts
type A = 'A';
type B = 'B';
type Twelve = 12;
```
이러한 타입을 두개 혹은 세개로 묶으려면 **유니온**타입을 사용한다.
```ts
type AB = 'A' | 'B';
type AB12 = 'A' | 'B' | 12;
```
세 개 이상의 타입을 묶을 때에도 동일하게 `|`을 사용하여 이어주면 된다. 이는 집합들의 합집합을 의미한다. 

```ts
const a: AB = 'A'; //정상 'A'는 집합 {'A', 'B'}의 원소이다.
const c: AB = 'C';
//~ '"C"' 형식은 'AB' 형식에 할당할 수 없습니다.
```
이렇게 타입스크립트의 에러 체크 과정에서 **할당 가능한**이라는 문구와 함께 안내를 하는 것을 볼 수 있다. 이는 **집합**의 관점에서, '~의 원소(값과 타입과의 관계)' 또는 '~의 부분집합(두 타입의 관계)'을 의미하는 것이다. 
집합의 관점에서 위의 에러는 `C` 유닛 타입이 다른 집합의 부분 집합에도 속하지 않으므로 에러가 발생하는 것이다. 

## 집합의 연산, 그리고 타입
### 인터섹션(교집합)
```ts
interface Person {
  name: string;
}
interface LifeSpan {
  birth: Date;
  death?: Date;
}
type PersonSpan = Person & Lifespan;
```
`&` 연산자는 두 타입의 인터섹션을(교집합)을 계산한다. `PersonSpan`이 공집합 타입으로 예상하기 쉬운데, **타입 연산자는 인터페이스의 속성이 아니라 값의 집합에 적용된다.** 그렇기 때문에, 결과적으로 PersonSpan타입은 아래와 같은 결과를 가진다.
```ts
const ps: PersonSpan = {
  name: 'Alan Turing',
  birth: new Date('1912/06/23');
  death: new Date('1954/06/07');
```
당연히, 구조적 타이핑의 원리에 따라서 위의 세 가지 속성보다 더 많은 속성을 가지는 값도 PersonSpan속성에 속할 수 있다. 

### 유니온
```ts
type K = keyo (Person | Lifespan); 
```
유니온 타입에 속하는 값은 어떠한 키도 없기 때문에, 유니온에 대한 keyof는 공집합이다.
정리하자면 아래와 같이 정리 가능하다.
```ts
keyof(A&B) = (keyof A) | (keyof B)
keyof(A|B) = (keyof B) & (keyof A)
```
인터페이스에 관한 것과 값에 대한 연산이 조금 다르게 작동하는 것을 헷갈려하면 안되겠다.

### extends 키워드
집합 간의 상속 관계를 표현하기 위하여 일반적으로 extend 키워드를 사용한다.
```ts
interface Person {
  name: string;
}
interface PersonSpan extends Person {
  birth: Date;
  death?: Date;
}
```
`extends`의 의미는 ~에 할당 가능한 과 비슷한 의미를 가지고 있으며, '~의 부분 집합' 이라는 의미로 받아들일 수 있다. 이를 밴 다이어그램으로 표현하면, `PersonSpan`은 `Person`의 서브타입이다.

#### 한정자로 쓰이는 extends 키워드
```ts
function getKey<K extends string>(val: any, key: K) {
  //...
}
```
이 코드에서 `K`는 `string`의 부분 집합 범위를 가지는 어떠한 타입이 된다.
```ts
getKey({}, 'x');
getKey({}, Math.random() < 0.5 ? 'a' : 'b');
getKey({}, document.title);
getKey({}, 12);
	// ~~ '12' 형식의 인수는 'string' 형식의 매개변수에 할당될 수 없습니다.
```
**할당될 수 없습니다**의 의미는, **상속할 수 없습니다**라고 바꿀 수 있고, 상속의 범위에서 보면 마지막 줄에서 왜 오류가 발생하는지 쉽게 판단할 수 있습니다.
```ts
interface Point {
  x: number;
  y: number;
}
type PointKeys = keyof Point;

function sortBy<K extends keyof T, T>(vals: T[], key: K): T[] }
	//..
}
const pts: Point[] = [{x: 1, y: 1}, {x: 2, y: 0}];
sortBy(pts, 'x'); //정상 'x'는 'x'|'y'를 상속
sortBy(pts, 'y'); //정상 'y'는 'x'|'y'를 상속
sortBy(pts, Math.random() < 0.5 ? 'x' : 'y' );
sortBy(pts, 'z');
	// ~~ '"z"' 형식의 인수는 '"x" | "y"' 형식의 매개변수에 할당될 수 없습니다.
```


## 결론은 타입을 집합 관점에서 바라보기
타입들이 엄격한 상속 관계가 아닐 때는 집합 스타일로 이들을 바라보는 것이 더욱 유용하다.
`string|number`와 `string | Date` 사이의 **인터섹션**은 공집합이 아닌, `string`이다. 타입이 집합이라는 관점은 **배열과 튜플의 관계**도 매우 명확하게 만든다.
이것 때문에 머리 아팠던 적이 한두번이 아닌데, 덕분에 명쾌하게 알 수 있었다.
```ts
const list = [1, 2]; //타입은 number[]
const tuple: [number, number] = list;
	// ~~ 'number[]' 타입은 '[number, number]' 타입의 0, 1 속성에 없습니다.
```
이 친구가 성립하지 않는 반례를 들자면, 숫자 쌍인 `[number, number]`은 빈 리스트 `[]`와 `[1]` 과 같은 반례가 존재하고 이를 포함하지 못한다. 그래서 `number[]`는 `[number, number]`의 **부분 집합**이 아니므로, 할당할 수 없는 것이다.
그러나, 반대로 할당하면 부분집합에 속하기 때문에 제대로 동작한다.

```ts
const triple: [number, number, number] = [1, 2, 3];
const double: [nubmer, number] = triple;
	//'[number, number, number]'형식은 '[number, number]' 형식에 할당할 수 없습니다. 'length' 속성의 형식이 호환되지 않습니다.
```
**구조적 타이핑**의 관점에서 생각하면 위의 코드는 에러 없이 잘 수행되어야 한다.
타입스크립트는 숫자의 쌍을 `{0: number, 1: number}` 이렇게 모델링하는 것이 아니라, `{0: number, 1: number, length: 2}`와 같이 모델링을 진행한다. 그래서 `length`의 값이 맞지 않아서 할당문에 오류가 발생하는 것이다.

결론적으로 이번 아이템이 전달하고자 하는 바를 정리하면 아래와 같다
> 'A는 B를 상속', 'A는 B에 할당 가능', 'A는 B의 서브타입' 은 **'A는 B의 부분 집합'**과 같은 의미이다. 