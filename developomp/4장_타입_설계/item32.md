# 유니온 인터페이스보다는 인터페이스의 유니온을 사용하기

```ts
// x1, y1, x2, y2, x3, y3
type TriangleData = [number, number, number, number, number, number];

// x1, y1, x2, y2 (top left then top right)
type RectangleData = [number, number, number, number];

// x, y, r
type CircleData = [number, number, number];

interface Shape {
  type: "triangle" | "rectangle" | "circle";
  data: TriangleData | RectangleData | CircleData;
}

let someShape: Shape = {
  type: "circle",
  data: [0, 0, 0, 0],
}; // 에러 없음!!
```

위 코드에서 `someShape`은 타입(타입스크립트 타입이 아닌 태그)이 `circle`임에도 불구하고
`data`가 `CircleData`가 아니다. 이러한 경우 에러가 발생한다면 도움이 되겠지만 위 코드는
어떠한 에러도 발생시키지 않는다. 심지어 `someShape.data`의 타입이
`TriangleData | RectangleData | CircleData`이기 때문에 모호함이 발생한다.

```ts
// x1, y1, x2, y2, x3, y3
type TriangleData = [number, number, number, number, number, number];

// x1, y1, x2, y2 (top left then top right)
type RectangleData = [number, number, number, number];

// x, y, r
type CircleData = [number, number, number];

interface Triangle {
  type: "triangle";
  data: TriangleData;
}

interface Rectangle {
  type: "rectangle";
  data: RectangleData;
}

interface Circle {
  type: "circle";
  data: CircleData;
}

type Shape = Triangle | Rectangle | Circle;

let someShape: Shape = {
  type: "circle",
  data: [0, 0, 0, 0],
}; // 에러!!
```

위 코드처럼 유니언의 인터페이스 대신 인터페이스의 유니언을 사용하면 `Shape` 타입의 범위를
효과적으로 좁힐 수 있다. 이제 `someShape`을 정의할 때 에러가 발생하고 `someShape.data`의
타입도 `CircleData`로 좁혀졌음을 확인할 수 있다.
