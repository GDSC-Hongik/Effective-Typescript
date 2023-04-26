# item24
# 일관성 있는 별칭을 사용하자.
## 별칭은 일관성 있도록 사용하는 것!
타입스크립트는 별칭을 사용하여 반복을 줄 일 수 있다.
```ts
const borough = {name: 'Brooklyn', location: [40.688, -73]};
const loc = borough.location;
```
이렇게 별칭을 지정하고 별칭의 값을 변경한다면, 원래 속성값도 변경이 된다.
그러나, 이렇게 별칭을 남발하면 제어 흐름을 분석하기 어렵다. 별칭을 신중하게 사용해야지 좋은 코드를 작성할 수 있다.
```ts
interface Polygon {
  exterior: Coordinate[];
  holes: Coordinate[][];
  bbox?: BoundingBox;
}
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const box = polygon.bbox;
  if (polygon.bbox) {
    if (pt.x < box.x[0] || pt.x > box.x[1] || pt.y < box.y[0] || pt.y > box.y[1]) {
      return false;
    }
  }
}
```
여기서는 `box.x`가 `undefined`라는 이유로 밑줄이 쳐진다. 그 이유를 살펴보자!
```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  polygon.bbox // 타입은 BoundingBox | undefined
  const box = polygon.bbox; // 타입은 BoundingBox | undefined
  if (polygon.bbox) {
    polygon.bbox // 타입은 BoundingBox 
    box // 타입은 BoundingBox | undefined
    if (pt.x < box.x[0] || pt.x > box.x[1] || pt.y < box.y[0] || pt.y > box.y[1]) {
      return false;
    }
  }
}
```
위와 같이 별칭을 사용해놓고 어떨 땐 사용 안하고.. 어떨 땐 사용하지 않는 일관성 있지 않은 코드를 작성하게 되면 당연히 타입이 그때그때 달라지는 것이다. `polygon.bbox`만 타입을 정제하는 데 성공했기 때문이다. **별칭을 일관성 있게 사용한다는 기본 원칙**을 지키면 방지할 수 있는 에러이다.

## 객체 비구조화를 이용하자
코드를 읽는 이에게는 `bbox`가 `box`로 사용되어 혼란을 초래한다. 그렇기 때문에 **객체 비구조화**를 사용하여 같은 이름으로 최대한 사용할 수 있다.
```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const {bbox} = polygon;
  if (bbox) {
    const {x, y} = bbox;
    if (pt.x < x[0] || pt.x > x[1] ||
        pt.y < y[0] || pt.y > y[1]) {
      return false;
    }
  }
}
```
하지만 객체 비구조화를 이용할 때 아래 주의사항을 기억하자.
- 전체 bbox속성이 아닌, x와 y가 선택적 속성일 때에는 **타입 속성 체크**를 꼭 진행하자.

## 별칭은 런타임에 혼동을 야기할 수 있다.
```ts
const { bbox } = polygon;
if (!bbox) {
  caculatePolygonBbox(polygon); //polygon.bbox가 채워진다.
}
```
`bbox`와 `polygon.bbox`는 다른 값을 참조하게 된다.
```ts
function fn(p: Polygon) {/* ... */}
polygon.bbox //타입이 BoundingBox | undefined
if (polygon.bbox) {
  polygon.bbox //타입은 BoundingBox
  fn(polygon);
}
```
함수 호출은 `polygon.bbox`를 제거할 가능성이 있기 때문에 타입을 원래대로 되돌리는 것이 안전할 수 있다.

