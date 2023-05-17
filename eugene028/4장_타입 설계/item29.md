# item29

이 글의 제목은 TCP와 관련하여 존 포스텔이 쓴 경고성 원칙(robustness principle)에서 나온 말이다.
> TCP 구현체는 견고성의 일반적인 원칙을 따라야 한다. 당신의 작업은 엄격하게 하고, 다른 사람의 작업은 너그럽게 받아들여야 한다.

이는 함수 시그니처의 타입에도 적용되는 말이다.
**함수의 매개변수는 타입의 범위가 넓어도** 괜찮지만, **결과를 반환할 때는 일반적으로 타입의 범위가** 구체적이어야 한다.

아래 타입을 보자.
```ts
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
여기서 `CameraOptions`의 필드는 모두 선택적이고, 심지어 여기에 덧붙여서 `LngLat` 이라는 타입까지 사용하고 있기 때문에 매우 넓다. 또 다른 타입을 지정해보자.
```ts
type LngLatBounds = 
{ northeast: LngLat, southwest: LngLat } |
[ LngLat, LngLat] |
[ number, number, number, number];
```
`LngLat`은 세가지 형태를 받을 수 있기 때문에 될 수 있는 형태가 19가지 이상이다. 이제 이러한 타입을 이용하는 함수 시그니처 타입을 작성해보자.
```ts
declare function viewportForBounds(bounds: LngLatBounds): CameraOptions;
```
```ts
function focusOnFeature(f: Feature) {
  const camera = viewportForBounds(bounds);
  setCamera(camera);
  const { center: {lat, lng}, zoom } = camera;
}
```
이 코드는 마지막 줄에서 에러가 발생한다. 
![](https://velog.velcdn.com/images/gene028/post/8bebaded-9c47-402f-97e1-1be10716ddda/image.png)

![](https://velog.velcdn.com/images/gene028/post/2c0bcaa8-a2f1-4563-bcd7-4aab9c7d940d/image.png)

이렇게 수많은 선택적 속성을 가지고 있기 때문에 어떤 타입을 선택해야 하는지 갈팡질팡 하게 되는 상황이 발생한다. 이는 타입에 대한 분기를 필수적으로 진행해야 한다. 코드가 길고 복잡해질 수 있지만 명확히 타입을 구분한다. 
예를 들어 배열과 배열 같은 것(array-like)의 구분을 하고 완전히 정의된 타입만을 함수의 반환 타입으로 사용할 수 있게끔 코드를 개선해 볼 수 있겠다.
```ts
interface Camera {
  center: LngLat;
  zoom: number;
  bearing: number;
  pitch: number;
}
interface CameraOptions extends Omit<Partial<Camera>, 'center'> {
  center?: LngLatLike;
}
type LngLatBounds = 
{northeast: LngLatLike, southwest: LngLatLike} | [LngLatLike, LngLatLike] | [number, number, number, number];
declare function viewportForBounds(bounds: LngLatBounds): Camera;
  ```
`Camera`가 너무 엄격하므로, 느슨한 타입으로 만드는 것이다. 대신 `center`는 `LngLatLike`을 사용한다는 것을 추출하여 명시할 수 있다. 너무 길다면 아래와 같이 간단히 작성할 수도 있다.
```ts
interface CameraOptions { 
  center?: LngLatLike;
  zoom?: number;
  bearing?: number;
  pitch?: number;
}
```
매개변수 타입은 반환 타입에 비하여 범위가 넓은 경향이 존재하지만, 선택적 속성과 유니온 타입을 적당히 사용하여 반환 타입을 최대한 줄이도록 하자.
