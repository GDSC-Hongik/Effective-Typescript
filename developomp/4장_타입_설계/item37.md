# 공식 명칭에는 상표를 붙이기

타입스크립트에서는 구조적 타이핑으로 인해 종종 원치 않는 상황이 생기곤 한다.

```ts
interface Vector2D {
  x: number;
  y: number;
}

function vector2DNorm(vector: Vector2D) {
  const { x, y } = vector;
  return Math.sqrt(x ** 2 + y ** 2);
}

vector2DNorm({ x: 3, y: 4 });

const vector3D = { x: 3, y: 4, z: 5 };
vector2DNorm(vector3D);
```

위 코드는 구조적 타이핑 관점에서 보면 문제가 없지만 수학적으로 생각하면 오류가 있는 코드다.
이러한 경우 상표(`_brand`) 속성을 사용해 문제를 해결할 수 있다.

예:

```ts
type AbsolutePath = string & { _brand: "abs" };

type Meters = number & { _brand: "meters" };

interface Vector2D {
  _brand: "2d";
  x: number;
  y: number;
}
```
