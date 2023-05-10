페이지를 구성할 때, 전역상태관리 도구로 recoil을 자주 이용한다.
가장 먼저 atom을 정의하고나서 값을 초기화 할 때 다양한 방법이 있지만, 주로 모든 값들을 null로 초기화하는 편이다.

이번 챕터에서는 null을 주로 다루기 때문에 이 역시 많은 참고가 될 것 같다.

```typescript
const extent = (nums: number[]) => {
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
};

const [min, max] = extent([0, 1, 2]);
console.log(min, max); // [1, 2]
```

예제로 나온 코드인데 nullCheck옵션을 끈 뒤 실행해보면  
우리가 의도한 결과와 달리 실제 실행코드는 [1, 2]가 나오게 된다.

근본적인 원인은 if(!min) 이 부분에 있는데, 우선 로직만 보더라도 min만 체크하고, max 값은 체크하지 않는 점이 부자연스럽다.  
게다가 모든 숫자를 다루는 함수의 특성상, 배열 안에 0이 담기게 될 경우 조건에 걸리기 때문에  
설령 if (!min || !max)를 하더라도 원하는 의도대로 동작하지 않을 뿐더러, 오히려 코드가 복잡해질 수 있다.

책에서는 null을 활용할 것을 제시하고 있는데 그 중 가장 좋아보인 방법은 아래와 같았다.

```typescript
const extent = (nums: number[]) => {
  let result: [number, number] | null = null;
  for (const num of nums) {
    if (!result) {
      result = [num, num];
    } else {
      result = [Math.min(num, result[0]), Math.max(num, result[1])];
    }
  }
  return result;
};

const result = extent([0, 1, 2]);
if (result) {
  const [min, max] = result;
  console.log(min, max);
}
```

null이 리턴되는지 아닌지 불확실한 상태를 가진 경우도, 코드의 질을 상당히 떨어뜨리게 되는데 그 예시는 아래와 같다.

```typescript
declare function fetchUser(userId: string): Promise<UserInfo>;
declare function fetchPostsForUser(userId: string): Promise<Post[]>;

class UserPosts {
  user: UserInfo | null;
  posts: Post[] | null;

  constructor() {
    this.user = null;
    this.posts = null;
  }

  async init(userId: string) {
    return Promise.all([
      async () => (this.user = await fetchUser(userId)),
      async () => (this.posts = await fetchPostsForUser(userId)),
    ]);
  }

  getUserName() {
    // username을 return하는 무언가의 로직
  }
}

const userPosts = new UserPosts();

userPosts.getUserName(); // null

const [user, posts] = await userPosts.init(userId);
userPosts.user = user;
userPosts.posts = posts;

userPosts.getUserName(); // ok
```

맨 처음 const userPosts = new UserPosts() 를 통해 함수를 실행할 때,  
init이 실행되기 전이므로 getUserName을 호출해도 null이 나올 수 밖에 없다.

따라서 init을 이용하여 얻은 결과를, 생성자함수를 통해 생성한 instance의 attribute에 대입해야 되는데  
객체 내부에서 처리되어야 할 로직을 외부에서 처리하고 있는 크나큰 결점이 존재하며, 무엇보다 코드가 너무 난잡해진다.

교재에서는 static 함수를 활용하는 것을 해법으로 사용하였는데, 그 결과는 아래와 같다.

```typescript
declare function fetchUser(userId: string): Promise<UserInfo>;
declare function fetchPostsForUser(userId: string): Promise<Post[]>;

class UserPosts {
  user: UserInfo;
  posts: Post[];

  constructor(user: UserInfo, posts: Post[]) {
    this.user = user;
    this.posts = posts;
  }

  static async init(userId: string): Promise<UserPosts> {
    const [user, posts] = await Promise.all([
      fetchUser(userId),
      fetchPostsForUser(userId),
    ]);
    return new UserPosts(user, posts);
  }

  getUserName() {
    return this.user.name;
  }
}

const userPosts = UserPosts.init(userId);
userPosts.getUserName(); // ok
```

static 함수를 이용하므로 따로 생성자 함수를 호출하지 않아도 된다는점, 외부에서 class의 로직을 구현하지 않아도 된다는 점 때문에  
코드가 상당히 개선된 것을 볼 수 있었다.
