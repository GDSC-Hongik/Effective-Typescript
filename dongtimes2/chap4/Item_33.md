타입은 최대한 구체적이어야 한다는 내용이었다.  
예를 들어 사이트의 유저는 아래와 같은 값을 가져야 한다고 해보자.  
유저는 일반회원, 혹은 기업회원으로 구분되는데,  
이 때 유저의 타입을 구체적으로 놓지 않고 string으로 폭 넓게 잡는다면  
타입이 잘못 입력되었어도 이를 확인할 수 있는 방법이 없다.

```typescript
interface IMember {
  name: string;
  password: string;
  address: string;
  type: string; // "normal" or "company"
}

const samsung: IMember = {
  name: "J-Dragon",
  password: "@#@!fds5",
  address: "suwon",
  type: "Company", // 잘못입력!
};
```

따라서 타입을 구체화 할 필요가 있는데, 명세에 따라 다음과 같이 적으면 될 것이다.

```typescript
interface IMember {
  name: string;
  password: string;
  address: string;
  type: "normal" | "company";
}
```
