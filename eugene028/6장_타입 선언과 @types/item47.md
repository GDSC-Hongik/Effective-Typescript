# item47
## 라이브러리에서 사용된 타입 찾아보기

그리고 앞으로 타입스크립트로 작성된/자바스크립트로 작성된 라이브러리의 타입들에 대하여 알아봐야 할 일들이 있을 텐데, 타입스크립트로 작성된 라이브러리 같은 경우에는 애초에 라이브러리 안에 타입 선언이 존재할 테지만, 자바스크립트로 작성된 라이브러리는 타입 선언이 위에 언급한 **DefinitelyTyped**에 공개되고 있으니 궁금하다면 한번씩 찾아보면 좋을 듯 하다.

또한 가끔 라이브러리에서 타입 정보를 익스포트하지 않아서 타입 선언에 대하여 찾아보기 어려울 때가 있다.
```ts
interface SecretName {
  first: string;
  last: string;
}

interface SecretSanta {
  name: SecretName;
  gift: string;
}
export function getGift(name: SecretName, gift: string): SecretSanta {
  //...
}
```
이럴 경우 `getGift`에 대한 타입은 `SecretSanta`라고 알 수 있겠지만, 라이브러리를 사용하는 입장에서는 `SecretName`이나 `SecretSanta`의 타입을 import해서 사용하고 싶을 수도 있을 것이다.
그럼 아래와 같이 작성해서 직접 추출을 해보자.
```ts
type MySanta = ReturnType<typeof getGift>; //SecretSanta
type MyName = Parameters<typeof getGift>[0]; //SecretName
```
되도록이면 많이많이 export 해주세요!! 천재 개발자님들 🥹
                          
