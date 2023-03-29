## *아이템 1 타입스크립트와 자바스크립트의 관계 이해하기*

*타입스크립트는 타입이 정의된 자바스크립트의 상위 집합이다.*

*⇒ .js 확장자를 가진 파일의 코드를 .ts 확장자로 바꿔도 문제가 생기지 않는다.*

*⇒ 기존 자바스크립트 코드를 타입스크립트로 마이그레이션하는 데 엄청난 이점이 된다.* 

*(기존 코드를 그대로 유지하면서 일부분에만 타입스크립트 적용이 가능하기 때문)*

*타입스크립트는 변수의 타입을 알려주지 않았는데도 초기값으로부터 타입을 추론한다.*

*타입 시스템의 목표 중 하나는 런타임에 오류를 발생시킬 코드를 미리 찾아내는 것이다.*

*타입스크립트는 타입 구문 없이도 오류를 잡을 수 있지만, 타입 구문을 추가하면 훨씬 더 많은 오류를 찾아낼 수 있다.*

*아래와 같이 타입 구문을 추가하면 어디에서 오류가 발생했는지를 명확하게 찾을 수 있다.*

```jsx
const states = [
    { name: 'a', capitol: 'b' },
    { name: 'b', capitol: 'c' },
    { name: 'c', capitol: 'd' },
];

for (const state of states) {
    console.log(state.capital);  // capital이 오타인지, capitol이 오타인지 구분 못 함
}

// 실행 결과
// undefined
// undefined
// undefined
```

```jsx
interface State {
    name: string;
    capital: string;
}

const states: State[] = [
    { name: 'a', capitol: 'b' },  // 오류 발생 지점이라는 것을 알고 있음
    { name: 'b', capitol: 'c' },
    { name: 'c', capitol: 'd' },
];

for (const state of states) {
    console.log(state.capital);
}
```

*타입스크립트는 자바스크립트의 런타임 동작을 모델링하는 것뿐만 아니라 의도치 않은 이상한 코드가 오류로 이어질 수 있기 떄문에 프로그램 상에서 오류가 발생하지 않더라도 타입 체커가 오류를 표시한다. 또한, 작성된 프로그램이 타입 체크를 통과하더라도 여전히 런타임에 오류가 발생할 수 있다.* 

*아래 예시에서는 타입스크립트는 앞의 배열이 범위 내에서 사용될 것이라 가정했지만 실제로는 그렇지 않았고 오류가 발생했다.*

```jsx
const names = ['A', 'B'];
console.log(names[2].toUpperCase());  // TypeError: Cannot read property 'toUpperCase' of undefined
```