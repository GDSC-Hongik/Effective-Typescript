## 아이템 34 부정확한 타입보다는 미완성 타입을 사용하기

아래 코드를 살펴보자.

```jsx
interface Point {
    type: 'Point';
    coordinates: number[];
}

interface LineString {
    type: 'LineString';
    coordinates: number[][];
}

interface Polygon {
    type: 'Polygon';
    coordinates: number[][];
}

type Geometry = Point | LineString | Polygon;
```

문제는 없는 코드이지만 좌표에 쓰이는 number[]가 약간 추상적이다.

이때, number[]는 경도와 위도를 나타내기 때문에 튜플 타입으로 선언하는 게 낫다고 생각해서 코드를 수정했다.

```jsx
type GeoPosition = [number, number];

interface Point {
    type: 'Point';
    coordinates: GeoPosition;
}
```

하지만, GeoJSON의 위치 정보에는 세 번째 요소인 고도가 있을 수 있고, 또 다른 정보가 있을 수도 있다.

타입 선언을 세밀하게 만들고자 했지만 오히려 타입이 부정확해졌다.

현재 타입 선언을 그대로 사용하려면 사용자들은 타입 단언문을 도입하거나 as any를 추가해서 타입 체커를 완전히 무시해야한다.

새 타입 선언은 더 구체적이지만 자동 완성을 방해하기 떄문에 타입스크립트 개발 경험을 해치게 된다.

타입이 구체적으로 정제된다고 해서 정확도가 무조건 올라가지는 않는다.