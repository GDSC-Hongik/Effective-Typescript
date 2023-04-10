# 한꺼번에 객체 생성하기

타입스크립트에서 변수는 타입 변경이 불가능하기 때문에 객체를 생성할 때 여러 속성을 모두
포함해 한 번에 생성하는 것이 타입 추론에 유리하다.

## 안 좋은 예

```ts
const point = {};
point.x = 0;
point.y = 0;
```

## 좋은 예

```ts
const point: Point = {
  x: 0,
  y: 0,
};
```

```ts
const data = { x: 0, y: 0 };

const point: Point = {
  ...data,
};
```
