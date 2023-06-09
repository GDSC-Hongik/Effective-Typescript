# item1: 타입스크립트와 자바스크립트 관계 이해하기
자바스크립트와 타입스크립트는 매우 관계가 깊은 언어이다.
이 둘의 관계를 정확히 이해하고 있다면 자바스크립트 기반으로 공부하였던 나에게 타입스크립트에 대한 이해를 더욱 쉽고 빠르게 할 수 있을 것으로 생각된다.

## 타입스크립트는 자바스크립트의 상위집합?
자바스크립트로 작성한 파일에 문법적인 오류가 존재하지 않는다면, 그것은 타입스크립트 프로그램이라고 할 수 있다.
타입스크립트는 자바스크립트의 상위 집합이기 때문에 이미 `.js` 파일이라고 작성한 것도, 타입스크립트라고 할 수 있는 것이다.
이러한 특성을 가지고 있기 때문에, 자바스크립트를 타입스크립트로 마이그레이션 하는데 매우 편리하고, 이 덕분에 강점을 가지고 있다고 할 수 있다.
```js
function greet(who){
  console.log(who);
}
```
이렇게 작성한 자바스크립트 코드를 아래와 같이 바꾸어 보자.
```js
function greet(who: string) }
	console.log("Hello", who);
}
```
`:string` 이라는 타입 구문을 작성하게 되면, 자바스크립트는 타입스크립트 영역으로 들어가게 된다.

## 타입스크립트의 안정성
타입스크립트가 타입 시스템을 사용하는 목표 중 하나는, 런타임에 오류를 발생시킬 코드를 미리찾아내는 것이다. 그리고, 오류가 발생하지 않아도 의도와는 다르게 동작하는 코드의 문제를 찾아낼 수 있다.

코드의 의도를 미리 타입스크립트에게 안내하고, 정확하게 오류를 집어낼 수 있는 것이다.
```js
interface State {
  name: string;
  capital: string;
}

const states: State[] = [
  {name: 'Alabama', capitol: 'Montogomery'},
  {name: 'Alaska', capitol: 'Juneau'},
  {name: 'Arizona', capitol: 'Phoenix'},
];

for (const state of states) {
  console.log(state.capital);
}
```
이제, 타입스크립트는 오류가 어디서 발생하였는지 정확히 집어낼 수 있다.
이제 전에 말하였던, 타입스크립트는 자바스크립트의 상위집합이다. 라는 문장을 더욱 정확하게 말할 수 있다.

>타입 체크에서 오류가 발생하지 않는 평소에 작성하는 코드는 타입 체커를 통과한 타입스크립트 프로그램이다.

정리하자면, 타입스크립트는 런타임 오류를 발생시키는 코드를 찾아내려 하며, 정확한 의도 전달을 통해 그 오류 해결을 더욱 명확히 할 수 있다.

## 자바스크립트 런타임 동작을 모델링하는 타입스크립트
타입스크립트는 자바스크립트의 런타임 동작의 원리를 모델링하여 사용한다. 그래서 느슨하게 동적으로 생기는 결과물을 평가해주던 자바스크립트와 동일하겠지~ 라고 생각하면 큰 코 다친다..
```js
const a = null + 7
```
위의 코드는 js에서 무리없이 7로 출력된다.
그러나, 타입스크립트 환경에서는 문제라고 한다. 타입 체커가 문제점이라고 확인하여 , 의도하지 않은 기능의 문제를 잡아낼 수 있는 것이다. 그러므로 타입스크립트가 이해하는 타입과 실제 값에 있어 차이가 나게 작성하면 안된다.

>이러한 문법의 엄격함은 취향의 차이! 하지만 더욱 안정적이고 안전한 코드를 작성하고 싶다면 타입스크립트를 이용하자.