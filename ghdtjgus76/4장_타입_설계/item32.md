## 아이템 32 유니온의 인터페이스보다는 인터페이스의 유니온을 사용하기

벡터를 그리는 프로그램을 작성 중이고, 특정 기하학적 타입을 가지는 계층의 인터페이스를 정의한다고 가정해보자.

```jsx
interface Layer {
	layout: FillLayout | LineLayout | PointLayout;
	paint: FillPaint | LinePaint | PointPaint;
}
```

layout이 LineLayout 타입이면서 paint 속성이 FillPaint 타입인 것은 말이 되지 않는다.

더 나은 방법으로 모델링하려면 아래와 같이 각각 타입의 계층을 분리된 인터페이스로 둬야 한다.

```jsx
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

이렇게 Layer를 정의하게 되면 layout과 paint 속성이 잘못 조합되는 것을 방지할 수 있다. 

따라서 유효한 상태만을 표현할 수 있게 된 것이다.

태그된 유니온으로도 이 상황을 잘 설명할 수 있다.

```jsx
 interface Layer {
	type: 'fill' | 'line' | 'point';
	layout: FillLayout | LineLayout | PointLayout;
	paint: FillPaint | LinePaint | PointPaint;
}
```

이전 상황에서와 같은 방식으로 처리해보자.

```jsx
 interface FillLayer {
	type: 'fill';
	layout: FillLayout;
	paint: FillPaint;
}

interface LineLayer {
	type: 'line';
	layout: LineLayout;
	paint: LinePaint;
}

interface PointLayer {
	type: 'paint';
	layout: PointLayout;
	paint: PointPaint;
}

type Layer = FillLayer | LineLayer | PointLayer;
```

type 속성은 ‘태그’이고 런타임에 어떤 타입의 Layer가 사용되는지 판단하는데 쓰인다.

타입스크립트는 태그를 참고해 Layer의 타입의 범위를 좁힐 수도 있다.

```
function drawLayer(layer: Layer) {
	if (layer.type === 'fill') {
		const {paint} = layer;  // 타입이 FillPaint
		const {layout} = layer;  // 타입이 FillPaint
	} else if (layer.type === 'line') {
		const {paint} = layer;  // 타입이 LinePaint
		const {layout} = layer;  // 타입이 LinePaint
	} else {
		const {paint} = layer;  // 타입이 PointPaint
		const {layout} = layer;  // 타입이 PointPaint
	}
}
```

태그된 유니온은 타입스크립트 타입 체커와 잘 맞는다.

어떤 데이터 타입을 태그된 유니온으로 표현할 수 있다면 그렇게 하는 것이 좋다.

또한, 여러 개의 선택적 필드가 동시게 값이 있거나 동시에 undefined인 경우도 태그된 유니온 패턴이 잘 맞는다.

다음 예시를 보자.

```tsx
interface Person {
	name: string;
	// 다음 속성들은 동시에 있거나 동시에 없다.
	placeOfBirth?: string;
	dateOfBirth?: Date;
}
```

위 경우 두 속성을 하나의 객체로 모으는 것이 더 나은 설계이다.

```jsx
interface Person {
	name: string;
	birth?: {
		place: string;
		date: Date;
	}
}
```

Person 객체를 매개변수로 받는 함수는 birth 하나만 체크하면 된다.

```jsx
function eulogize(p: Person) {
	console.log(p.name);

	const {birth} = p;

	if (birth) {
		console.log(`was born on ${birth.date} in ${birth.place}`);
	}
}
```

아래와 같이 표현해도 된다.

```tsx
interface Name {
	name: string;
}

interface PersonWithBirth extends Name {
	placeOfBirth: string;
	dateOfBirth: Date;
}

type Person = Name | PersonWithBirth;

function eulogize(p: Person) {
	if ('placeOfBirth' in p) {
		p;  // 타입이 PersonWithBirth
	}
}
```