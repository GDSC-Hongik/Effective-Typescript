## *아이템 16 number 인덱스 시그니처보다는 Array, 튜플, ArrayLike를 사용하기*

*자바스크립트에서는 객체에서 숫자 키가 허용되지 않는다.* 

*해당 키는 문자열로 변환되어 표현된다.*

*타입스크립트의 경우 숫자 키를 허용하고 문자열 키와 다른 것으로 인식한다.*

```jsx
// ts
const xs = [1, 2, 3];

const x1 = xs['1'];
// ~ 인덱스 식이 'number' 형식이 아니므로
// 요소에 암시적으로 'any' 형식이 있다.
```

*자바스크립트에서 Object.keys를 이용해서 배열의 키를 나열해보면 키가 문자열로 출력된다.*

*이는 타입스크립트에서도 동일하다.*

*다만 타입스크립트 코드 맨 마지막 줄이 이상하게 여겨질 수도 있는데, 배열을 순회하는 코드 스타일에 대한 실용적인 허용으로 생각하면 된다.*

```jsx
x = [1, 2, 3];
Object.keys(x);  // ['0', '1', '2']
```

```jsx
const xs = [1, 2, 3];

const keys = Object.keys(xs);  // 타입이 string[]

for (const key in xs) {
	key;  // 타입이 string
	const x = xs[key];  // 타입이 number
}
```

*인덱스를 신경 쓰지 않는다면 배열 순회 시 for-of를 사용하는 것이 더 좋다.*

```jsx
for (const x of xs) {
	x;  // 타입이 number
}
```

*인덱스의 타입이 중요하다면, number 타입을 제공해줄 Array.prototype.forEach를 사용하면 된다.*

```jsx
xs.forEach((x, i) => {
	x;  // 타입이 number
	i;  // 타입이 number
}
```

*루프 중간에 멈춰야 하는 경우가 있다면, for 루프를 사용하는 것이 좋다.*

```jsx
for (let i = 0; i < xs.length; i++) {
	const x = xs[i];
	if (x < 0) break;
}
```

*타입이 불확실한 경우, for-in 루프는 for-of 또는 C 스타일 for 루프에 비해 몇 배나 느리다.*

*인덱스 시그니처가 number로 표현되어 있다면 입력한 값이 number여야하지만, 실제 런타임에 사용되는 키는 string 타입이다.*

*어떤 길이를 가지는 배열과 비슷한 형태의 튜플을 사용하고 싶다면 타입스크립트에 있는 ArrayLike 타입을 사용한다.*

```jsx
function checkedAccess<T>(xs: ArrayLike<T>, i: number): T {
	if (i < xs.length) {
		return xs[i];
	}

	throw new Error(`배열의 끝을 지나서 ${i}를 접근하려고 했습니다.`);
}
```

```jsx
const tupleLike: ArrayLike<string> = {
	'0': 'A',
	'1': 'B',
	length: 2
};
```

*인덱스 시그니처에 number를 사용하는 것보다 Array나 튜플, 또는 ArrayLike 타입을 사용하는 것이 좋다.*