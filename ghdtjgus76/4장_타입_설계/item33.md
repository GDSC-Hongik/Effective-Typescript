## 아이템 33 string 타입보다 더 구체적인 타입 사용하기

string 타입으로 변수를 선언하려고 한다면, 그보다 더 좁은 타입이 적절하지는 않을지 검토해봐야 한다.

아래 코드를 보자.

```tsx
interface Album {
	artist: string;
	title: string;
	releaseDate: string;
	recordingType: string;
}
```

위와 같이 인터페이스를 정의하면, 잘못된 형식의 문자열이 들어올 수도 있다.

하지만, 해당 문자열 또한 할당 가능하고 타입 체커를 통과한다.

예를 들어 releaseDate가 원하는 문자열은 ‘YYYY-MM-DD’ 형식이지만 받은 문자열 값은 ‘August 17th, 1959’인 것처럼.

앞의 예는 string 타입이 남용되어 선언되어 있다.

앞의 오류를 방지하기 위해 타입을 좁히는 방법을 도입해야한다.

artist나 title 같은 필드에는 string 타입이 적절하다. 

하지만 releaseDate 필드는 Date 객체를 사용해서 날짜 형식으로만 제한하는 것이 좋다.

recordingType 필드는 ‘live’와 ‘studio’, 두 값으로 유니온 타입을 정의할 수 있다.

```jsx
type RecordingType = 'studio' | 'live';

interface Album {
	artist: string;
	title: string;
	releaseDate: Date;
	recordingType: RecordingType;
}

const kindOfBlue: Album = {
	artist: 'Miles Davis',
	title: 'Kind of Blue',
	releaseDate: new Date('1959-08-17');
	recordingType: 'studio'
}
```

이러한 방식에는 세 장점이 더 있다.

- 타입을 명시적으로 정의해서 다른 곳으로 값이 전달되어도 타입 정보가 유지된다.
- 타입을 명시적으로 정의하고 해당 타입의 의미를 설명하는 주석을 붙여넣을 수 있다.

```jsx
/** 이 녹음은 어떤 환경에서 이루어졌는지? */
type RecordingType = 'live' | 'studio';
```

- keyof 연산자로 더 세밀하게 객체의 속성 체크가 가능해진다.

```tsx
function pluck(records, key) {
	return records.map(r => r[key]);
}

function pluck(records: any[], key: string): any[] {
	return records.map(r => r[key]);
}
```

    위 코드는 언더스코어 라이브러리의 pluck 함수와 그 시그니처를 작성한 것이다.

타입 체크가 되기는 하지만 any 타입이 있어 정밀하지 못하다.

또한, 반환 값에 any가 있어 좋지 않은 설계이다.

타입 시그니처를 개선하기 위해 제너릭과 keyof 연산자를 도입하였다.

```jsx
function pluck<T>(records: T[], key: keyof T) {
	return records.map(r => r[key];
}  
```

만약, keyof 연산자 대신 string을 썼다면 타입스크립트는 key의 타입이 string이기 때문에 범위가 너무 넓다는 오류를 발생시킨다. 

아래 코드를 봐보자.

```jsx
const releaseDates = pluck(albums, 'releaseDate');  // 타입이 (string | Date)[]
```

releaseDates 타입은 Date[]이어야 한다.

아직 범위가 넓다.

범위를 더 좁히기 위해서 keyof T의 부분 집합으로 두 번째 제너릭 매개변수를 도입해야한다. 

다음 코드를 보자.

```jsx
function pluck<T, K extends keyof T>(records: T[], key: K): T[K][] {
	return records.map(r => r[key]);
}
```

이렇게 하면 타입 시그니처가 완벽해졌다.

string은 any와 비슷한 문제를 가지고 있어 잘못 사용하게 되면 무효한 값을 허용하고 타입 간 관계도 감추어 버린다.

타입스크립트에서 string의 부분 집합을 정의할 수 있는 기능은 자바스크립트 코드에 안전성을 크게 높인다.