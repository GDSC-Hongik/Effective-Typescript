## *아이템 24 일관성 있는 별칭 사용하기*

*아래 코드에서는 borough.location 배열에 loc이라는 별칭(alias)를 만들었다.*

*별칭의 값을 변경하면 원래 속성 값에서도 변경된다.* 

```jsx
const borough = {
    name: 'Brooklyn',
    location: [40.688, -73.979]
};

const loc = borough.location;
```

```jsx
loc[0] = 0;
borough.location  // [0, -73.979]
```

*아래 코드는 잘 동작하지만 반복되는 부분이 많다.*

```jsx
interface Coordinate {
    x: number;
    y: number;
}

interface BoundingBox {
    x: [number, number];
    y: [number, number];
}

interface Polygon {
    exterior: Coordinate[];
    holes: Coordinate[];
    bbox?: BoundingBox;
}

function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
    if (polygon.bbox) {
        if (pt.x < polygon.bbox.x[0] || pt.x > polygon.bbox.x[1] || pt.y < polygon.bbox.y[0] || pt.y > polygon.bbox.y[1]) {
            return false;
        }
    }
}
```

*중복을 줄이기 위해 임시 변수를 뽑아내서 다시 표현할 수 있다.*

*다만 아래 코드는 동작은 하지만 편집기에서 오류로 표시된다.*

*속성 체크는 polygon.bbox의 타입을 정제했지만 box에는 해당하지 않았다.*

```jsx
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
    const box = polygon.bbox;

    if (polygon.bbox) {
        if (pt.x < box.x[0] || pt.x > box.x[1] || pt.y < box.y[0] || pt.y > box.y[1]) {
            // ~ 객체가 'undefined'일 수 있다.
            return false;
        }
    }
}
```

```jsx
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
    const box = polygon.bbox;  // 타입이 BoundingBox | undefined

    if (polygon.bbox) {
        polygon.bbox;  // 타입이 BoundingBox
        box;  // 타입이 BoundingBox | undefined
    }
}
```

*속성 체크에 box를 사용하도록 변경하면 된다.*

```jsx
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
    const box = polygon.bbox;

    if (box) {
        if (pt.x < box.x[0] || pt.x > box.x[1] || pt.y < box.y[0] || pt.y > box.y[1]) {
            return false;
        }
    }
}
```

*타입 체커의 문제는 해결되었지만, 한 가지 문제가 남아있다.*

*box와 bbox는 같은 값인데 다른 이름을 사용해 혼란을 가져올 수 있다.*

*이때 객체 비구조화를 사용하면 간결한 문법으로 일관된 이름을 사용할 수 있다.*

```jsx
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
    const { bbox } = polygon.bbox;

    if (bbox) {
        const { x, y } = bbox;
        if (pt.x < x[0] || pt.x > x[1] || pt.y < y[0] || pt.y > y[1]) {
            return false;
        }
    }
}
```

*다만, 객체 비구조화 사용 시에도 주의 사항이 있다.*

*전체 bbox 속성이 아니라 x와 y가 선택적 속성인 경우 속성 체크가 더 필요하다. ⇒ 타입의 경계에 null 값을 추가하는 것이 좋다.*

*또한, 별칭은 타입 체커뿐만 아니라 런타임에도 혼동을 가져올 수 있다.*

```jsx
const { bbox } = polygon;

if (!bbox) {
    calculatePolygonBbox(polygon);  // polygon.bbox가 채워진다.
    // polygon.bbox와 bbox는 다른 값을 참조한다.
}
```

*fn(polygon) 함수 호출은 polygon.bbox를 제거할 가능성이 있어 타입을 BoundingBox | undefined로 되돌리는 것이 안전할 것이다.*

하지만 *함수 호출 시마다 속성 체크를 반복해야하는 번거로움이 있다.*

*polygon.bbox 대신 bbox 지역 변수로 사용하면 bbox 타입은 정확히 유지되지만, polygon.bbox의 값과 다르게 유지될 수 있다.* 

```jsx
function fn(p: Polygon) {}

if (polygon.bbox) {
	polygon.bbox;  // 타입이 BoundingBox
	fn(polygon);
	polygon.bbox;  // 타입이 BoundingBox
}
```

*별칭은 타입스크립트가 타입을 좁히는 것을 방해할 수 있으니 변수에 별칭을 사용할 때는 일관되게 사용해야 한다.*

*또한, 함수 호출이 객체 속성의 타입 정제를 무효화할 수 있어 주의해야한다.*

*속성보다 지역 변수를 사용하면 타입 정제를 믿을 수 있다.*