# item33
`string` 타입의 범위는 매우 넓다. `"x"`나 `"y"` 같은 한 글자도, 120만 줄이 넘는 글도 모두 string타입이기 때문에 이러한 타입으로 변수를 선언하려면 이보다 더욱 좁은 타입이 있을 수 있는지 검토해보아야 한다.
```ts
interface Album {
  artist: string;
  title: string;
  releaseDate: string; // YYYY-MM-DD
  recordingType: string; // live 또는 studio
}
```
`string`이 남발되었다.. 그리고 엉뚱한 값을 배정하여도 배정이 문제 없이 되는 것을 확인할 수 있다.
```ts
const kindOfAlbum = {
  artist: 'Miles Davis';
  title: 'Kind of Blue';
  releaseDate: 'August 17th 1959';
  recordingType: 'Studio';
}
```
string을 사용하게 되면 설정한 인터페이스와 일치하지 않는데도 오류 없이 지나가게 되어 타입 체커를 통과하게 된다. 
```ts
function recordRelease(title: string, date: string){/*...*/}
recordRelease(kindOfBlue.releaseDate, kindOfBlue.title);
```
이렇게 매개변수 순서를 실수로 잘못 작성해도 별 문제 없이 넘어가게 된다. 이런 현상을 아래와 같이 정리할 수 있는데..
> 문자열을 남발하여 선언되었다.(stringly typed)

라고 표현된다. 앞의 오류를 방지하기 위하여 남발하여 사용된 string 타입을 좁혀나가 보자.
```ts
type RecordingType = 'studio' | 'live';
interface Album {
  artist: string;
  title: string;
  releaseDate: Date;
  recordingType: RecordingType;
}
```
이렇게 코드를 바꾸게 되면 타입스크립트는 더욱 세밀하게 타입 체크를 진행한다.

## string 타입을 좁힘으로써 나타나는 장점
### 타입을 명시적으로 정의하여, 다른 곳으로 값이 전달되어도 타입 정보가 유지된다.
```ts
function getAlbumsOfType(recordingType: string): Album[] {
  //...
}
```
`getAlbumsOfType` 함수를 호출하는 곳에서 `recordingType`의 값이 string 타입이어야 한다는 것 말고도 추가적인 정보가 존재한다. 타입은 stdio, live인데 이것이 바로 `Album`의 정의에 숨어 있기 때문이다.

### 타입을 명시적으로 정의하고 해당 타입의 의미를 설명하는 주석을 붙여 넣을 수 있다.
```ts
type RecordingType = 'live' | 'studio';
/** 이 녹음은 어떤 환경에서 이루어졌는지? */
```
이렇게 주석을 작성하게 되면 `getAlbumsOfType`를 받은 매개변수를 string 대신 RecordingType으로 바꿔줄 수 있고, 함수를 사용하는 곳에서 설명을 확인할 수 있다.

### keyof 연산자를 이용하여 세밀하게 객체의 속성 체크를 할 수 있다. 
어떤 배열에서 한 필드의 값만을 추출하는 함수를 작성한다고 생각해보자.
```ts
function pluck(records, key) {
  return records.map(r => r[key]);
}
```
`pluck`함수의 시그니처를 다음처럼 작성할 수 있겠다.
```ts
function pluck(records: any[], key: string): any[] {
  return records.map(r => r[key]);
}
```
any타입이 존재해서 정밀하지 못하고, 함수의 반환 타입도 너무 넓게 설계되어 있어 올바르지 못한 설계라고 할 수 있다. 
```ts
function pluck<T>(records: T[], key: string) : any[] {
  return records.map(r => r[key]);
}
```
key타입이 string이기 때문에, 범위가 너무 넓다는 오류를 발생시킨다.`Album`을 전달하게 되면 모든 string Key 값이 아니라 `artist`, `title`, `releaseDate`, `recordingType` 이 네가지 키값만 가능하다.
```ts
type K = keyof Album;
```
이렇게 키값들을 설정해 두고, string을 아래와 같이 바꾼다.
```ts
function pluck<T>(records: T[], key: keyof T) {
  return records.map(r => r[key]);
}
```
![](https://velog.velcdn.com/images/gene028/post/2f8708e9-9e4e-49f6-89d4-558022580dc0/image.png)

pluck에 마우스를 올려두게 되면 이렇게 추론된 형태가 뜬다. 여기서 `T[keyof T]`는 객체 내의 가능한 모든 값의 타입인데, 아래처럼 이렇게 string값을 직접 넣는다고 가정해보자.
```ts
const releaseDates = pluck(albums, 'releaseDate');
```
여기서 `releaseDate`의 타입은 string이거나, Date로 판단된다. 원래는 Date[]로 판단되는 것이 정상일 것이다. 여기서 알 수 있는 점은, `keyof T`는 string에 비하여 범위가 좁은 것은 맞으나, 그래도 여전히 넓은 범위라고 판단된다. 이를 해결하기 위하여, 두 번째 제너릭 매개변수를 도입할 수 있다.
```ts
function pluck<T, K extends keyof T>(records: T[], key: K): T[k][] }
	return records.map(r => r[key]);
}
```
그럼 아래와 같이 타입 추론을 올바르게 진행한다.
```ts
pluck(albums, 'releaseDate'); //타입이 Date[]
pluck(albums, 'artist'); // string[]
pluck(albums, 'recordingType'); //RecordingType[]
pluck(albums, 'recordingDate'); //그런거 없다..
```
`string`은 `any`와 비슷한 녀석이다. 잘못 사용하게 되면 무효한 값을 허용하고, 타입 간의 관계를 감추어 버릴 수 있다. 게다가 편집기의 자동 완성 기능도 유용하게 사용할 수 있으므로, 되도록이면 string 타입을 이용하기보다는 명확하게 타입을 정의하여 사용하도록 하자. 객체의 속성 이름을 함수 매개변수로 받을 때, string으로 받기보다는 `keyof`를 사용해보는 것은 어떤가!! 작은거부터 하나하나 시작해보자.