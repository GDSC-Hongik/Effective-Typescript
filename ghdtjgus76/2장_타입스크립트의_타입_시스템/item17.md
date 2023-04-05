## *아이템 17 변경 관련된 오류 방지를 위해 readonly 사용하기*

*아래와 같이 배열 안의 숫자들을 모두 합치는 함수를 작성하였다.*

*계산이 끝나면 원래 배열이 전부 비게 된다.*

*자바스크립트 배열을 내용을 변경할 수 있기 때문에 타입스크립트에서도 오류 없이 통과하게 된다.* 

```jsx
function arraySum(arr: number[]) {
    let sum = 0, num;

    while ((num = arr.pop()) !== undefined) {
        sum += num;
    }

    return sum;
}
```

*위 코드에서 오류의 범위를 좁히기 위해서 readonly 접근 제어자를 사용해 arraySum이 배열을 변경하지 않는다는 선언을 해보면 다음과 같다.*

*이때 오류가 발생한다.*

*readonly number[]는 타입인데, number[]와는 다른 점이 있다.*

- *배열의 요소를 읽을 수는 있지만 쓸 수는 없다.*
- *length를 읽을 수는 있지만 바꿀 수는 없다.*
- *배열을 변경하는 pop과 같은 메서드를 호출할 수 없다.*

```jsx
function arraySum(arr: readonly number[]) {
    let sum = 0, num;

    while ((num = arr.pop()) != undefined) {
        sum += num;  // ~ 'readonly number[]' 형식에 'pop' 속성이 없다.
    }

    return sum;
}
```

*number[]는 readonly number[]의 서브타입이 된다.*

*변경 가능한 배열을 readonly 배열에 할당이 가능하지만, 반대는 불가능하다.*

```jsx
const a: number[] = [1, 2, 3];
const b: readonly number[] = a;
const c: number[] = b;
// ~ 'readonly number[]' 타입은 'readonly'이므로
// 변경 가능한 'number[]' 타입에 할당될 수 없다.
```

*매개 변수를 readonly로 선언하면 타입스크립트는 매개 변수가 함수 내에서 변경이 일어나는지 체크한다.*

*자바스크립트에서도 타입스크립트에서도 명시적으로 언급하지 않으면 함수가 매개변수를 변경하지 않는다고 가정한다.*

*하지만 명시적으로 readonly를 선언해주는 것이 더 좋다.*

*앞의 arraySum의 경우 배열을 변경하지 않도록 readonly를 사용하면 다음과 같다.*

```jsx
 function arraySum(arr: readonly number[]) {
    let sum = 0;

    for (const num of arr) {
        sum += num;
    }

    return sum;
}
```

*readonly를 사용할 때의 단점도 존재하는데, 매개 변수가 readonly로 선언되지 않은 함수를 호출하는 경우도 있다는 것이다.*

*어떤 함수를 readonly로 만들면 그 함수를 호출하는 다른 함수도 모두 readonly로 만들어야 한다.*

*번거롭기는 하지만 인터페이스를 명확히 하고 타입 안전성을 높일 수 있어 오히려 좋다.*

*다만, 다른 라이브러리에 있는 함수 호출의 경우 타입 선언을 바꿀 수 없어 타입 단언문(as number[])를 사용해야한다.*

*아래와 같은 코드는 개발자의 의도대로 작동하지 않는다.*

*currPara의 내용을 paragraphs에 삽입하고, currPara만 빈 배열로 설정하려고 했지만, paragraphs에 currPara의 내용이 삽입되지 않고 배열의 참조가 삽입되었다.*

*currPara에 새 값을 채우거나 지우면 동일 객체를 참조하는 paragraphs 요소에도 변경이 반영된다.*

```jsx
paragraphs.push(currPara);
currPara.length = 0;
```

*push와 달리 concat은 원본을 수정하지 않고 새 배열을 반환한다.*

*const 대신 let을 이용해서 변수 선언 후, 타입을 readonly로 설정하였다.*

*currPara 변수는 가리키는 배열을 자유롭게 변경 가능하지만 배열 자체는 변경하지 못하게 된다.*

```jsx
let currPara: readonly string[] = [];
currPara = [];
currPara = currPara.concat([line]);
```

*여전히 paragraphs에는 오류가 뜨는데, 이에 대한 해결 방법이 몇 가지 있다.*

*currPara의 복사본을 만들게 되면, currPara는 readonly로 유지되지만 복사본은 변경이 가능하다.*

```jsx
paragraphs.push([...currPara]);
```

*paragraphs를 readonly string[]의 배열로 변경하는 방법도 있다.*

*이때 readonly string[][]과 (readonly string[])[]과는 다르다.*

```jsx
const paragraphs: (readonly string[])[] = [];
```

*또한, 배열의 readonly 속성을 제거하기 위해서 단언문을 쓰는 방법도 있다.*

```jsx
paragraphs.push(currPara as string[]);
```

*readonly는 얕게 동작한다.*

*객체의 readonly 배열이 있다면 객체 자체는 readonly가 아니다.*

*또한 객체에 사용되는 Readonly 제너릭에도 해당된다.*

*두 번째 코드에서 readonly 접근제어자는 inner에 적용되는 것이지 x에는 해당하지 않는다.*

```jsx
const dates: readonly Date[] = [new Date()];
dates.push(new Date());
// ~ 'readonly Date[]' 형식에 'push' 속성이 없다.
dates[0].setFullYear(2037); 
```

```jsx
interface Outer {
	inner: {
		x: number;
	}
}

const o: Readonly<Outer> = { inner: { x: 0 }};
o.inner = { x: 1 };
// ~ 읽기 전용 속성이기 때문에 'inner'에 할당할 수 없다.
o.inner.x = 1;
```

*인덱스 시그니처에 readonly를 사용하면 객체의 속성이 변경되는 것을 방지할 수 있다.*

```jsx
let obj: {readonly [k: string]: number} = {};
// 또는 Readonly<{[k: string]: number}>
obj.h1 = 45;
// ~ 형식의 인덱스 시그니처는 읽기만 허용된다.
obj = {...obj, h1: 12};
obj = {...obj, bye: 34};
```