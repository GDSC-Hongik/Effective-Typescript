# 콜백에서 this에 대한 타입 제공하기

자바스크립트에서 `let`, `const` 등으로 정의된 변수는 어디서 선언했는지에 따라 유효 범위가
결정되는 결정되는 렉시컬 스코프를 사용한다. 그러나 `this`의 경우에는 사용되는 방식에 따라
유효 범위가 정해지는 다이나믹 스코프를 사용한다. 즉, 타입스크립트에서 `this`를 사용할 때는
타입이 정확하게 추론될 수 있도록 충문한 맥락을 제공해주어야 한다.
