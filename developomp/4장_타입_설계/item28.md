# 유효한 상태만 표현하는 타입을 지향하기

```ts
type RequestState = {
  state: "pending" | "ok" | "error";
  response?: string;
  error?: string;
};

const requestState: RequestState = {
  state: "error",
}; // 에러 없음
```

위 코드에서 `RequestState` 타입은 `state`의 값에 따라서 따라서 `response`나 `error`가
존재할 수도, 존재하지 않을 수도 있는 객체를 모델링한다. 그러나 `requestState` 변수에서 볼
수 있듯이 `error`가 존재하지 않는 (유효하지 않은) 경우에도 타입 에러가 발생하지 않는다.

```ts
interface RequestPending {
  state: "pending";
}

interface RequestSuccess {
  state: "ok";
  response: string;
}

interface RequestError {
  state: "error";
  error: string;
}

type RequestState = RequestPending | RequestError | RequestSuccess;

const requestState: RequestState = {
  state: "error",
}; // 타입 에러!
```

반면 위 코드에서 `RequestState` 타입은 유호한 값만을 허용하기 때문에 `requestState`의
값 역시 유효함을 기대할 수 있다.
