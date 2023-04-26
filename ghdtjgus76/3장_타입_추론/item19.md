## *아이템 19 추론 가능한 타입을 사용해 장황한 코드 방지하기*

*타입스크립트의 많은 타입 구문은 사실 불필요하다.*

*코드의 모든 변수에 타입을 선언하는 것은 좋지 않다.*

*타입 추론이 되는 경우 명시적 타입 구문은 필요하지 않다.*

```jsx
let x: number = 12;

let x = 12;  // 이 정도 코드로 충분하다.
```

```jsx
const person: {
	name: string;
	born: {
		where: string;
		when: string;
	};
	died: {
		where: string;
		when: string;
	} = {
		name: 'Sojourner Truth',
		born: {
			where: 'Swartekill, NY',
			when: 'c.1797',
		},
		died: {
			where: 'Battle Creek, MI',
			when: 'Nov. 26, 1883'
		}
	}
}

const person = {
	name: 'Sojourner Truth',
	born: {
		where: 'Swartekill, NY',
		when: 'c.1797'
	},
	died: {
		where: 'Battle Creek, MI',
		when: 'Nov. 26, 1883'
	}
}  // 타입을 생략해도 된다.
```

```jsx
function square(nums: number[]) {
    return nums.map((x) => x*x);
}

const squares = square([1, 2, 3, 4]);
```

```jsx
const axis1: string = 'x';  // 타입은 string
const axis2 = 'y';  // 타입은 'y'
```

*아래 코드에서 인터페이스 내부 속성의 타입을 변경한다면, logProduct 함수 내부에 명시적으로 타입 선언한 부분에서 에러가 난다.*

*이때는 비구조화 할당을 통해서 구현하는게 낫다.*

*비구조화 할당문은 모든 지역 변수의 타입이 추론되도록 한다.*

*따라서 이에 추가적으로 명시적 타입 구문은 작성하지 않는 것이 좋다.*

```jsx
interface Product {
    id: number;
    name: string;
    price: number;
}

function logProduct(product: Product) {
    const id: number = product.id;
    const name: string = product.name;
    const price: number = product.price;
    
    console.log(id, name, price);
}
```

```jsx
interface Product {
    id: string;
    name: string;
    price: number;
}

function logProduct(product: Product) {
    const { id, name, price } = product;

    console.log(id, name, price);
}
```

```jsx
interface Product {
    id: string;
    name: string;
    price: number;
}

function logProduct(product: Product) {
    const { id, name, price }: { id: string; name: string; price: number } = product;
		// 비구조화 할당에서 타입 추론을 해주기 때문에 명시적 타입 선언은 불필요하다.
    console.log(id, name, price);
}
```

*타입스크립트 코드는 함수/메서드 시그니처에 타입 구문을 포함하지만, 함수 내에서 생성된 지역 변수에는 타입 구문을 넣지 않는다.*

*기본값을 넣는 경우 함수 매개 변수에 타입 구문을 생략하는 경우도 있다.*

*또한, 타입 정보가 있는 라이브러리에서 콜백 함수의 매개 변수 타입은 자동으로 추론된다.*

```jsx
app.get('/health', (request: express.Request, response: express.Response)) => {
    response.send('OK');
}

// 아래와 같이 코드를 작성하면 된다.
app.get('/health', (request, response) => {
    response.send('OK');
})
```

*타입이 추론됨에도 타입을 명시하고 싶은 상황이 있는데, 객체 리터럴 정의할 때이다.*

*아래와 같이 타입을 명시하면 잉여 속성 체크가 동작한다.*

*타입 구문을 제거하면 잉여 속성 체크가 동작하지 않을 뿐만 아니라 객체를 선언한 곳이 아니라 객체가 사용되는 곳에서 타입 오류가 발생한다.*

```jsx
const elmo: Product = {
    name: 'Tickle Me Elmo',
    id: '048188 627152',
    price: 28.99
}

const furby = {
    name: 'Furby',
    id: 604939292,
    price: 35,
};

logProduct(furby);
// ~ ... 형식의 인수는 'Product' 형식의 매개변수에 할당될 수 없다.
// 'id' 속성의 형식이 호환되지 않는다.
// 'number' 형식은 'string' 형식에 할당될 수 없다.
```

*다음과 같이 함수의 반환에도 타입을 명시해서 오류를 방지할 수 있다.*

*타입 추론이 가능하더라도 구현상 오류가 함수를 호출한 곳까지 영향을 미치지 않도록 하기 위해서 타입 구문을 명시하는 것이 좋다.*

*타입을 명시하지 않으면 함수를 호출한 코드에서 에러가 발생하게 된다.*

```jsx
const cache: {[ticker: string]: number} = {};

function getQuote(ticker: string): Promise<number> {
    if (ticker in cache) {
        return cache[ticker];
        // ~ 'number' 형식은 'Promise<number>' 형식에 할당할 수 없다.
    }

    return fetch(`https://quotes.example.com/?q=${ticker}`)
        .then((response) => response.json())
        .then((quote) => {
            cache[ticker] = quote;
            return quote;
        })
}
```

*아래 코드에서 타입스크립트는 반환 타입을 { x: number; y: number; }로 추론했다.*

*반환 타입을 명시하면 더욱 직관적인 표현이 되고, 반환 값을 별도의 타입으로 정의하면 타입에 대한 주석을 작성할 수 있어 자세한 설명이 가능하다.*

```jsx
interface Vector2D {
    x: number;
    y: number;
}

function add(a: Vector2D, b: Vector2D) {
    return { x: a.x + b.x, y: a.y + b.y };
}
```

### ***반환 타입을 명시해야하는 이유를 정리하면 다음과 같다.***

- *오류의 위치를 제대로 표시해준다.*
- *함수를 구현하기 전에 테스트를 먼저 작성하여 테스트 주도 개발(TDD)을 할 수 있게 된다.*
- *명명된 타입을 사용할 수 있다.*

***eslint 규칙 중 no-inferrable-types를 사용하면 작성된 모든 타입 구문이 필수적인지 확인할 수 있다.***