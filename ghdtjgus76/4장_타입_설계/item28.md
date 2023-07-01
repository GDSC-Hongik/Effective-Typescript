## 아이템 28 유효한 상태만 표현하는 타입을 지향하기

효과적으로 타입을 설계하려면 유효한 상태만 표현할 수 있는 타입을 만들어내야한다.

웹 애플리케이션을 만든다고 가정해보자.

애플리케이션에서 페이지 선택 시 페이지의 내용을 로드하고 화면에 표시한다.

페이지 상태는 아래와 같이 설계했다.

```jsx
interface State {
	pageText: string;
	isLoading: boolean;
	error?: string;
}
```

페이지를 그리는 renderPage 함수 작성 시에는 상태 객체의 필드를 전부 고려해서 상태 표시를 분기해야한다.

```jsx
function renderPage(state: State) {
	if (state.error) {
		return `Error!`;
	} else if (state.isLoading) {
		return `Loading ${currentPage}`;
	}
	return `<h1>${currentPage}</h1>\n${state.pageText}`;
}
```

위 상황에서는 분기 조건이 명확히 분리되어 있지 않다.

isLoading이 true인 동시에 error 값이 존재하는 경우는 명확히 구분되지 않는다.

페이지를 전환하는 changePage 함수는 다음과 같다.

```jsx
async function changePage(state: StaticRange, newPage: string) {
    state.isLoading = true;

    try {
        const reponse = await fetch(getUrlForPage(newPage));
        if (!response.ok) {
            throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
        }

        const text = await response.text();
        state.isLoading = false;
        state.pageText = text;
    } catch (e) {
        state.error = '' + e;
    }
}
```

이 함수에는 여러 문제점이 있다.

- 오류 발생 시 state.isLoading을 false로 설정하는 로직이 빠져있다.
- state.error를 초기화하지 않아 페이지 전환 중에 로딩 메시지 대신 오류 메시지를 보여주게 된다.
- 페이지 로딩 중 사용자가 페이지를 바꾸면 어떤 일이 벌어질 지 예상하기 어렵다. 새 페이지에 오류가 뜨거나 응답이 오는 순서에 따라서 두 번째 페이지가 아니라 첫 번째 페이지로 전환될 수도 있다.

이는 바로 상태 값의 두 가지 속성이 동시에 정보가 부족(요청이 실패했는지 로딩 중인지 알 수 없다.)하거나, 두 가지 속성이 충돌(오류이면서 동시에 로딩 중)할 수 있기 때문이다.

State 타입의 경우 isLoading이 true이면서 동시에 error값이 설정되는 상태를 허용한다.

이 상태, 즉 무효한 상태를 허용하면 render()와 changePage()를 둘 다 제대로 표현할 수 없다.

다음 코드는 애플리케이션 상태를 조금 더 명확하게 표현한 방법이다.

```jsx
interface RequestPending {
    state: 'pending';
}

interface RequestError {
    state: 'error';
    error: string;
}

interface RequestSuccess {
    state: 'ok',
    pageText: string;
}

type RequestState = RequestPending | RequestError | RequestSuccess;

interface State {
    currentPage: string;
    requests: {[page: string]: RequestState};
}
```

위의 경우 네트워크 요청 과정 각 상태를 명시적으로 나타내는 태그된 유니온을 사용했다.

이렇게 개선된코드로 renderPage와 changePage 함수는 쉽게 구현되었다.

```jsx
function renderPage(state: State) {
    const { currentPage } = state;
    const requestState = state.requests[currentPage];

    switch(requestState.state) {
        case 'pending':
            return `Loading ${currentPage}`;
        case 'error':
            return 'Error';
        case 'ok':
            return `<h1>${currentPage}</h1>\n${requestState.pageText}`;    
    }
}

async function changePage(state: State, newPage: string) {
    state.requests[newPage] = { state: 'pending' };
    state.currentPage = newPage;

    try {
        const response = await fetch(getUrlForPage(newPage));

        if (!response.ok) {
            throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
        }

        const pageText = await response.text();
        state.requests[newPage] = { state: 'ok', pageText };
    } catch (e) {
        state.requests[newPage] = { state: 'error', error: '' + e }; 
    }
}
```

위 코드에서는 현재 페이지가 무엇인지 명확하고 모든 요청은 정확히 하나의 상태로 맞아 떨어진다.

요청이 진행 중인 상태에서 사용자가 페이지를 변경해도 문제가 없다.