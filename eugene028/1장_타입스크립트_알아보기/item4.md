# item4: 구조적 타이핑에 익숙해지기
자바스크립트는 어떤 함수의 매개변수 값이 모두 제대로 주어진다면, 그 값이 어떻게 만들어졌는지 신경 쓰지 않고 사용한다. 이것을 바로 **덕 타이핑 기반**이라고 한다.
그래서 타입스크립트는 매개변수 값이 요구사항을 만족한다면, 자바스크립트의 **타입을 신경 쓰지 않는 동작을** 그대로 모델링한다. 

예시를 통하여 이해하여 보자.
```js
interface Vector2D {
  x: number;
  y: number;
}
```
이를 계산하는 함수는 아래와 같다.
```js
function calculateLength(v: Vector2D){
  return Math.sqrt(v.x * v.x + v.y * v.y);
}
```
이 상황에서 `Vector2D` 함수를 수정한다면 어떻게 될까?
```ts
interface NamedVector {
  name: string;
  x: number;
  y: number;
}
```
`NamedVector`는 `x`와 `y`가 존재하기 때문에, 위의 함수를 그대로 이해할 수 있다.
그 이유는 타입스크립트가 자바스크립트의 **런타임 동작을 모델링**하였기 때문인데, `NamedVector`의 구조가 `Vector2D`와 호환되기 때문이다. 
> 이 상황을 바로 구조적 타이핑을 사용한다고 이해하면 된다.

하지만 이런 구조적 타이핑 때문에 문제가 발생하기도 한다.
```ts
interface Vector3D {
  x: number;
  y: number;
  z: number;
}
```
벡터의 길이를 1로 만들어주는 함수를 사용하여 보자.
```ts
function normalize(v: Vector3D) {
  const length = calculateLength(v);
  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length,
  };
}
```
`calculateLength` 함수가 애초에 2차원 기반으로 만들어졌으니까, 당연히 원하는 결과를 얻을 수 없다. 그럼 왜 이 문제는 에러가 발생하지 않고 3D백터를 매개변수로 잡아내는 것일까?

## 구조적 타이핑의 관점
구조적 타이핑은 매개변수 값이 요구사항을 만족한다면, 자바스크립트의 **타입을 신경 쓰지 않는 동작을** 그대로 모델링한다고 했다. `calculateLength`입장에서는 x, y가 존재하기 때문에 Vector2D와 호환되는 것이다. 그래서 오류가 발생하지 않은 것이고, 타입 체커가 문제라고 짚지 않은 것이다.

그래서, 타입스크립트의 타입은 항상 **열려**있다. 매개변수의 속성이 매개변수에 타입에 선언된 속성만을 가질 것이라고 생각하면, **봉인된** 타입이라고 생각하는 것인데, 이러한 생각 때문에 실수를 하게 되는 것이다.

```ts
function calculateLength1(v: Vector3D) {
  let length = 0;
  for (const axis of Object.keys(v)) {
    const coord = v[axis];
    	//'string'은 'Vector3D'의 인덱스로 사용할 수 없기에 엘리먼트는 임시적으로 '`any'타입입니다.
    length += Math.abs(coord);
  }
  return length;
}
```
우리는 Vector3D의 프로퍼티에 대한 속성을 `number`로 지정해뒀다. 그런대 왜 이런 요상한 오류가 뜨는 것일까?
그 이유는 바로 아래와 같이 작성하게 될 수 있기 때문이다.
```ts
const vec3D = {x: 3, y: 4, z: 1, address: '123 Broadway'};
calculateLengthL1(vec3D); //정상.. NaN을 반환한다.
```
함수는 **오픈**된 친구이기 때문에, axis의 타입이 string이 될수도 있다. 그래서 타입스크립트는 `v[axis]`의 타입을 `Number`라고 확정할 수 없는 것이다. 그래서 정확한 타입으로 객체를 루프 돌리는 코드는 어렵다.
이왕이면 아래와 같이 작성하는 것이 깔끔하며 예기치 못한 오류를 줄이는 방법이 되겠다.
```ts
function calculateLengthL1(v: Vector3D){
  return Math.abs(v.s) + Math.abs(v.y) + Math.abs(v.z);
}
```
## 테스팅에 편리한 구조적 타이핑
```ts
interface Author {
  first: string;
  last: string;
}
function getAuthors(database: PostgresDB): Author[] {
  const authorRows = database.runQuery('SELECT FIRST, LAST FROM AUTHORS');
  return authorRows.map(row => ({first: row[0], last: row[1]}));
```
이 상태에서 원래는 `PostgresDB`를 생성해야 한다. 하지만 아래와 같이 작성한다면 더욱 편리하게 테스팅을 진행할 수 있다.
```ts
interface DB {
  runQuery: (sql: string) => any[];
}
function getAuthors(database: DB): Author[] {
  const authorRows = database.runQuery('SELECT FIRST, LAST FROM AUTHORS');
  return authorRows.map(row => ({first: row[0], last: row[1]}));
```
이렇게 작성하게 되면 실제 구조적으로 유사한 `postgresDB`도 `getAuthors` 함수를 사용할 수 있고, `DB`도 사용이 가능하다. 해당 인터페이스만 충족해도 괜찮기 때문이다. 
추상화를 통하여 **특정한 구현**으로부터 분리할 수 있다는 점이 유용하게 사용할 수 있다.