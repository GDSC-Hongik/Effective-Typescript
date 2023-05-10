## 아이템 31 타입 주변에 null 값 배치하기

어떤 변수가 null이 될 수 있는지 없는지는 타입만으로는 명확하게 표현하기 어렵다.

예를 들어, B 변수가 A 변수의 값으로부터 비롯되는 값이라면 A가 null이 될 수 없을 때 B 역시 null이 될 수 없고, A가 null이 될 수 있다면 B 역시 null이 될 수 있다.

```tsx
function extent(nums: number[]) {
    let min, max;

    for (const num of nums) {
        if (!min) {
            min = num;
            max = num;
        } else {
            min = Math.min(min, num);
            max = Math.max(max, num);
        }
    }

    return [min, max];
}
```

위 코드는 strictNullChecks 없이 타입 체커를 통과하고 반환 타입은 number[]로 추론된다.

하지만, 이는 설계적 결함이 있는 코드이다.

- 최솟값이나 최댓값이 0인 경우, 값이 덧씌워져 버린다. extent([0, 1, 2])의 결과는 [0, 2]가 아니라 [1, 2]가 된다.
- nums 배열이 비어있다면 함수는 [undefined, undefined]를 반환한다.

이때, strictNullChecks 설정을 키면 두 문제가 드러나게 된다.

```tsx
function extent(nums: number[]) {
    let min, max;

    for (const num of nums) {
        if (!min) {
            min = num;
            max = num;
        } else {
            min = Math.min(min, num);
            max = Math.max(max, num);
						// ~ 'number | undefined' 형식의 인수는
						// 'number' 형식의 매개변수에 할당될 수 없다.
        }
    }

    return [min, max];
}
```

extent의 반환 타입이 (number | undefined)[]로 추론된다.

이제 extent를 호출하는 곳마다 타입 오류의 형태로 나타난다.

```jsx
const [min, max] = extent([0, 1, 2]);
const span = max - min;
// ~ 개체가 'undfined'인 것 같다.
```

위 함수의 오류는 undefined를 min에서만 제외하고 max에서는 제외하지 않아 발생했다.

max에 대한 체크를 추가하는 것보다 나은 해결 방법은 min과 max를 한 객체에 넣고 null이거나 null이 아니게 하면 되는 것이다.

```jsx
function extent(nums: number[]) {
    let result: [number, number] | null = null;

    for (const num of nums) {
        if (!result) {
            result = [num, num];
        } else {
            result = [Math.min(num, result[0]), Math.max(num, result[1])];
        }
    }

    return result;
}
```

null 아님 단언(!)을 사용하거나 if 구문을 사용하면 min과 max를 얻을 수 있다.

```jsx
const [min, max] = extent([0, 1, 2])!;
const span = max - min;
```

```jsx
const range = extent([0, 1, 2]);
if (range) {
	const [min, max] = range;
	const span = max - min;
}
```

null과 null이 아닌 값을 섞어서 사용하면 클래스에서도 문제가 생긴다.

아래 코드를 보자.

```jsx
class UserPosts {
	user: UserInfo | null;
	posts: Post[] | null;

	constructor() {
		this.user = null;
		this,posts = null;
	}

	async init(userId: string) {
		return Promise.all([
			async () => this.user = await fetchUser(userId);
			async () => this.posts = await fetchPostsForUser(userId);
		]);
	}

	getUserName() {
	
	}
}
```

위와 같이 설계하게 되면 두 번의 네트워크 요청이 로드되는 동안 user와 posts 속성은 null 상태이고, 어떤 시점에는 둘 다 null, 둘 중 하나만 null, 둘 다 null이 아닐 수 있다.

이는 버그를 양산할 수 있다.

아래 코드는 이를 개선한 코드이다.

```jsx
class UserPosts {
	user: UserInfo;
	posts: Post[];

	constructor(user: UserInfo, posts: Post[]) {
		this.user = user;
		this,posts = posts;
	}

	static async init(userId: string): Promise<UserPosts> {
		const [user, posts] = await Promise.all([
            fetchUser(userId),
            fetchPostsForUser(userId)
        ]);

        return new UserPosts(user, posts);
	}

	getUserName() {
        return this.user.name;
	}
}
```

이제 UserPosts 클래스는 완전히 null이 아니게 되어 문제가 해결되었다.

결론적으로, 한 값의 null 여부가 다른 값의 null 여부에 암시적으로 관련되도록 설계하면 안 된다.

또한, API 작성 시에는 반환 타입을 큰 객체로 만들고 반환 타입 전체가 null이거나 null이 아니게 만들어야 한다.