# item3: 코드 생성과 타입이 관계없음을 이해하기

타입스크립트 컴파일러는 크게 다음 두 가지 역할을 수행하고, 이 둘은 완벽히 독립적으로 작동한다.

1. 자바스크립트로의 트랜스파일
2. 코드의 타입 오류 체크

## 타입 오류가 있는 코드도 컴파일이 가능하다

코드의 트랜스파일과 타입 오류 체크는 독립적으로 작동하기 때문에 코드에 타입 오류가 있다고
해서 컴파일이 되지 않는 것은 아니다. 이 점은 오류가 없는 다른 부분을 테스트할 때 유용하게
사용할 수 있다. 만약 타입 오류 발생 시 컴파일하지 않게 설정하고 싶다면 `noEmitOnError`
옵션을 사용할 수 있다.

## 런타임에는 타입 체크가 불가능하다

타입스크립트 코드 컴파일 시 `enum`을 제외한 `interface`, `type` 등 모든 타입스크립트
정의와 타입 구문등은 사라지기 때문에 자바스크립트 런타임에선 타입 체크가 불가능하다. 만약
schema validation이 필요하다면 [zod] 등의 외부 라이브러리를 활용하고, object의 타입
정보를 유지하고 싶다면 type indicator를 사용할 수 있다.

다음 코드를 살펴보자:

```ts
interface SuccessResponse {
  success: true;
  data: string;
}

interface FailResponse {
  success: false;
  reason: string;
}

type Response = SuccessResponse | FailResponse;

const res: Response = someFunction();

if (res.success) {
  console.log("Success: ", res.data);
} else {
  console.error("Fail: ", res.reason);
}
```

`Response` 타입은 `SuccessResponse`와 `FailResponse`의 유니언 타입이고, 각
인터페이스는 boolean literal 타입의 `success` 속성을 가지고 있다. 그리고 이 속성은
런타임 환경에서도 유지되기 때문에 `Response`의 종류를 확인할 수 있고, IDE에서도
`success`의 값에 따라 autocomplete에서 보여주는 값들이 다르기 때문에 매우 유용하게 쓸 수
있다. 예를 들어 `if` 블럭 안에서는 `success`와 `data`만을 보여주고, `else` 블럭 안에서는
`success`와 `reason`만을 보여준다.

## 타입 연산은 런타임에 영향을 주지 않는다

다음은 타입스크립트를 처음 배웠을때 본인이 실제로 작성했던 코드다.

```ts
function toType<T>(value: unknown): T {
  return value as T;
}
```

위 코드는 언뜻 보면 문제가 없어보인다. 심지어 아래처럼 사용해도 IDE나 컴파일러에서 전혀
에러가 나지 않는다.

```ts
const num: number = toType("string");
```

그러나 컴파일된 결과를 보자.

```js
function toType(value) {
  return value;
}
```

문제가 매우 명백히 보인다. 컴파일 과정에서 타입 관련 구문은 모두 사라지기 때문에 위 함수는
그저 인자를 그대로 돌려주는 함수가 되버린다.

## 런타임 타입은 선언된 타입과 다를 수 있다

다음 코드를 보자

```ts
const response = fetch("some/api/path");
const result = response.json() as Data;
```

위 코드 두 번째 줄에서 `response.json()`의 결과를 `Data` 타입으로 사용하고는 있지만
런타임 환경에서 생각대로 동작하리란 보장은 없다. `response.json()`의 결과가 유효한
`Data`가 아닌 다른 object일 수도 있고 string일 수도 있다.

## 타입스크립트 타입으로는 함수를 오버로드할 수 없다

타입스크립트에서 하나의 함수에 대해 여러 번 선언할 수는 있지만 단 한개의
구현체만(implementation) 가질 수 있다.

## 타입스크립트 타입은 런타임 성능에 영향을 주지 않는다

런타임 성능은 오로지 생성된 자바스크립트 코드와 런타임 환경에 의해 결정된다. 따라서 타입 관련
구문에 빌드타임 오버헤드는 있을지언정 런타임 오버헤드는 없다는 것을 알 수 있다.

[zod]: https://zod.dev
