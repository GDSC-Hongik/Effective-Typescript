# item31

타입스크립트를 사용할 때 처음으로 가장 어렵다고 느껴진 부분이 바로 `null`에 대한 것과 `undefined` 에 대한 처리이다. 어떤 변수가 `null`이 될 수 있는지 없는지를 명확하게 알 수 없고 타입만으로도 처리할 수 없기 때문이다. 
값이 전부 null이거나, 전부 null이 아닌 경우로 분명히 구분된다면 다루기가 쉬울 것이다. 타입에 null을 추가하는 방식으로 모델링을 진행해보자.
```ts
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
    return [min, max];
}
```
배열의 최소, 최댓값을 찾는 함수이며 아래와 같은 설계적 단점이 존재한다.
- 최소값이나 최대값이 0인 경우 값이 덧씌워져 버린다. `extend` 값이 `[0, 1, 2]`인 경우 결과는 `[1, 2]`가 되어버림.
- nums 배열이 비어 있다면 `[undefined, undefined]`가 반환된다. 그렇기 때문에 해당 함수에 대하여 다음 오류가 반환된다.
![](https://velog.velcdn.com/images/gene028/post/19ccf93a-14c7-4d13-84cd-142f766588ce/image.png)

추론된 형태를 보아도 설계적 결함이 분명히 존재한다는 것을 확인할 수 있었다. 이 오류는 `min`만 `undefined`를 걸러내었고, `max`는 필터링 과정을 거쳐 주지 않았기 때문에 발생한다. 해결법으로는 아래 해결을 고려해볼 수 있겠다.
> min, max를 한 객체 안에 넣고 null이거나 null이 아니게 하면 된다.

```ts
function extent (nums: number[]) {
  let result: [number, number] | null = null;
  for (const nums of nums) {
    if (!result) {
      result = [num, num];
    } else {
      result = [Math.min(num, result[0]), Math.max(num, result[1])];
    }
  }
  return result;
}
```
이제 결과값으로 단일 객체를 얻을 수 있고, 타입스크립트가 null과 값 사이의 관계를 이해할 수 있도록 하였으며 존재하던 설계적 오류를 해결할 수 있게 된 것이다. 다음 예시를 통하여 어떨 때 null을 배치해야 하는지 조금 더 자세히 알아보도록 하자.
```ts
class UserPosts {
  user: UserInfo | null;
  posts: Post[] | null;
  constructor() {
    this.user = null;
    this.posts = null;
  }
  async init(userId: string) {
    return Promise.all([
      async () => this.user = await fetchUser(userId),
      async () => this.posts = await fetchPostsForUser(userId);
    ]);
  }
```
두 번의 네트워크 요청이 로드되는 동안, user와 posts 속성은 `null` 상태이다. 어떨 때는 하나만 Null이거나, 둘다 Null인 상황이 존재하여 많은 불확실성이 존재하게 된다. 이를 개선해보자.
```ts
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
      fetchPostsForUser(userId);
    ]);
    return new UserPosts(user, posts);
  }
  getUserName(){
    return this.user.name;
  }
}
```
이제 클래스에서는 완전히 null로 되는 일은 없애게 되었고, 데이터가 부분적으로 준비될 수 있겠으나 그 때에는 상태를 다루는 코드를 따로 작성해주면 된다. 
결론적으로, 한 값의 null 여부가 다른 값의 Null 여부에 암시적으로 관련되도록 설계하면 안된다. 그리고 API 작성 시에는 반환 타입을 큰 객체로 만들고, **반환 타입 전체가 null이거나 null이 아니게 만들어야 한다.** 



