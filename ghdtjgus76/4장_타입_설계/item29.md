## 아이템 29 사용할 때는 너그럽게, 생성할 때는 엄격하게

함수 시그니처에 이 규칙을 적용해야한다.

함수의 매개변수는 타입의 범위가 넓어도 되지만 결과 반환 시에는 일반적으로 타입의 범위가 더 구체적이어야한다.

아래 코드에서 3D 매핑 API는 카메라의 위치를 지정하고 경계 박스의 뷰포트를 계산하는 방법을 제공한다.

```jsx
declare function setCamera(camera: CameraOptions): void;
declare function viewportForBounds(bounds: LngLatBounds): CameraOptions;
```

카메라 위치를 잡기 위해 viewportForBounds의 결과가 setCamera로 바로 전달된다면 편리할 것이다.

아래는 CameraOptions와 LngLat 타입의 정의이다.

```jsx
interface CameraOptions {
	center?: LngLat;
	zoom?: number;
	bearing?: number;
	pitch?: number;
}

type LngLat = 
	{ lng: number; lat: number; } |
	{ lon: number; lat: number; } |
	[number, number];
```

일부 값은 건드리지 않으면서 동시에 다른 값을 설정할 수 있어야 하기 때문에 Camera Options의 필드는 모두 선택적이고, LngLat 타입도 setCamera의 매개변수 범위를 넓혀준다.

```jsx
type LngLatBounds = 
	{ northeast: LngLat, southwest: LngLat } |
	[LngLat, LngLat] |
	[number, number, number, number];
```

```jsx
function focusOnFeature(f: Feature) {
	const bounds = calculateBoundingBox(f);
	const camera = viewportForBounds(bounds);
	setCamera(camera);
	const { center: {lat, lng}, zoom } = camera;
	// ... 형식에 'lat' 속성이 없다.
	// ... 형식에 'lng' 속성이 없다.
	zoom;  // 타입이 number | undefined
}
```

수많은 선택적 속성을 가지는 반환 타입과 유니온 타입은 함수 사용을 어렵게 만든다.

매개 변수 타입의 범위가 넓으면 사용하기 편리하지만 반환 타입의 범위가 넓으면 불편하다.

사용하기 편리한 API일수록 반환 타입이 엄격하다.

유니온 타입의 요소별 분기를 위한 방법 중 하나는 좌표를 위한 기본 형식을 구분하는 것이다.

LngLat과 LngLatLike로 구분하여 나타내는 것 말이다.

Camera가 너무 엄격해서 조건을 완화해서 느슨한 CameraOptions 타입을 만들었다.

```tsx
interface LngLat { lng: number, lat: number; };
type LngLatLike = LngLat | { lon: number; lat: number } | [number, number];

interface Camera {
    center: LngLat;
    zoom: number;
    bearing: number;
    pitch: number;
};

interface CameraOptions extends Omit<Partial<Camera>, 'center'> {
    center?: LngLatLike;
}

type LngLatBounds = 
    {northeast: LngLatLike, southwest: LngLatLike} |
    [LngLatLike, LngLatLike] |
    [number, number, number, number];

declare function setCamera(camera: CameraOptions): void;
declare function viewportForBounds(bounds: LngLatBounds): Camera;
```

```jsx
function focusOnFeature(f: Feature) {
	const bounds = calculateBoundingBox(f);
	const camera = viewportForBounds(bounds);
	setCamera(camera);
	const { center: {lat, lng}, zoom } = camera;
	zoom;  // 타입이 number
}
```

위처럼 표현하게 되면 함수 사용이 훨씬 쉬워진 것을 볼 수 있다.