타입을 설계하기 위해서는 최대한 유효한 상태를 나타내기 위한 고민이 필요하다.
특히나 페이지를 표현함에 있어, API 요청의 결과가 isSuccess인지, isFailure인지를 구분하는 과정과 그 결과에 따른 state를 또 다시 설정하는 작업이 종종 있었는데, 많은 참고가 된 것 같다.

지금도 코드를 짜라고 하면 아래와 같이 짤 가능성이 높은 것 같은데, 아래 코드의 문제점을 생각해보면

- state.error 값과 state.isLoading이 항상 상호베타적인 관계라고 확신할 수 없다. error 값과 isLoading이 모두 존재하면 상태를 명확히 구분할 수 없다.

```typescript
interface State {
  pageText: string;
  isLoading: boolean;
  error?: string;
}

const renderPage = (state: State) => {
  if (state.error) {
    return `Error! Unable to load ${currentPage}: ${state.error}`;
  } else if (state.isLoading) {
    return `Loading ${currentPage}...`;
  }
  return `<h1>${currentPage}</h1>\n${state.pageText}`;
};
```

- 에러핸들링에 의해 catch문으로 진입했을 때, state.isLoading을 false로 바꿔주는 로직이 존재하지 않으며
- state.error를 초기화하는 로직이 없다.

```typescript
async function changePage(state: State, newPage: string) {
  state.isLoading = true;
  try {
    const response = await fetch(getUrlForPage(newPage));
    if (!response.ok) {
      throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
    }
    const text = await response.text();
    state.isLoading = false;
    state.pageText = text;
  } catch (e) {
    state.error = "" + e;
  }
}
```

따라서 상태를 정확히 표현하기 위해 타입을 올바르게 설계한 것이 아래와 같다.

```typescript
interface RequestPending {
  state: "pending";
}
interface RequestError {
  state: "error";
  error: string;
}
interface RequestSuccess {
  state: "ok";
  pageText: string;
}
type RequestState = RequestPending | RequestError | RequestSuccess;

interface State {
  currentPage: string;
  requests: { [page: string]: RequestState };
}
```

```typescript
function renderPage(state: State) {
  const { currentPage } = state;
  const requestState = state.requests[currentPage];
  switch (requestState.state) {
    case "pending":
      return `Loading ${currentPage}...`;
    case "error":
      return `Error! Unable to load ${currentPage}: ${requestState.error}`;
    case "ok":
      return `<h1>${currentPage}</h1>\n${requestState.pageText}`;
  }
}

async function changePage(state: State, newPage: string) {
  state.requests[newPage] = { state: "pending" };
  state.currentPage = newPage;
  try {
    const response = await fetch(getUrlForPage(newPage));
    if (!response.ok) {
      throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
    }
    const pageText = await response.text();
    state.requests[newPage] = { state: "ok", pageText };
  } catch (e) {
    state.requests[newPage] = { state: "error", error: "" + e };
  }
}
```

일단 상태를 단순히 하나의 객체로만 생각하는 것을 넘어, 각각의 상태를 union으로 표현한 것이 매우 인상깊은 코드였다.
