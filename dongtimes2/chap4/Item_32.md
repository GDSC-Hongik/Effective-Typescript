유니온의 인터페이스보다는, 인터페이스의 유니온을 사용하라는 말이 처음에는 잘 와닿지가 않았다.  
아래 예시를 살펴보자.

```typescript
interface Layer {
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint;
}
```

분명 잘 정의된 타입인 것 같지만, 이 역시 설계상의 결함이 존재한다.  
만약 Layer를 사용하는 누군가가, layout은 LineLayout을 paint는 FillPaint를 사용한다면 논리상의 오류가 발생한다.  
위와 같은 경우가 유니온의 인터페이스에 해당한다.
(item 28에서 본 내용과 결을 같이한다)

따라서 아래와 같이 타입을 설계하면 논리상의 오류를 해결할 수 있다.

```typescript
interface FillLayer {
  layout: FillLayout;
  paint: FillPaint;
}
interface LineLayer {
  layout: LineLayout;
  paint: LinePaint;
}
interface PointLayer {
  layout: PointLayout;
  paint: PointPaint;
}
type Layer = FillLayer | LineLayer | PointLayer;
```

이런 식으로 타입을 정의하면, 원치않는 잘못된 조합으로 타입이 오용되는 경우를 막을 수 있다.

더 나아가 "태그된 유니온"이라는 기법도 이용할 수 있는데 아래와 같이 사용한다.

```typescript
interface FillLayer {
  type: "fill";
  layout: FillLayout;
  paint: FillPaint;
}
interface LineLayer {
  type: "line";
  layout: LineLayout;
  paint: LinePaint;
}
interface PointLayer {
  type: "paint";
  layout: PointLayout;
  paint: PointPaint;
}
type Layer = FillLayer | LineLayer | PointLayer;
```

조건절에 type을 체크하여 어떤 interface가 현재 런타임에 사용되는지도 파악할 수 있다는 장점이 있다.  
&nbsp;  
또한 타입 간의 관계를 생각하는 것도 좋은 타입 설계중에 하나인데,  
그저 주석으로 타입 간 관계를 나타내는 것보다는 직접 관계를 구현하는 것이 좋은 방법이다.

예를 들어 생일과 태어난 곳 각각을 선택적인 타입으로 갖으며, 둘은 모두 존재하거나, 혹은 둘 모두 존재하지 않음을 표현하고자 할 때

```typescript
interface Person {
  name: string;
  // These will either both be present or not be present
  placeOfBirth?: string;
  dateOfBirth?: Date;
}
```

위와 같이 그저 타입간 관계를 주석으로 표시하는 것보다는 아래와 같은 방향으로 설계하는게 더 올바르다고 볼 수 있다.

```typescript
interface Person {
  name: string;
  birth?: {
    place: string;
    date: Date;
  };
}
```
