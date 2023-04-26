## *아이템 25 비동기 코드에는 콜백 대신 async 함수 사용하기*

*과거 자바스크립트에서는 비동기 동작을 모델링하기 위해 콜백을 사용하였고, 이로 인해 콜백 지옥이라는 말이 나오게 되었다.*

```jsx
fetchURL(url1, function (response1) {
    fetchUrl(url2, function (response2) {
        fetchURL(url3, function (response3) {
            // ...
            console.log(1);
        })

        console.log(2);
    })

    console.log(3);
})

console.log(4);

// 4
// 3
// 2
// 1
```

*콜백 지옥에 대한 대안으로 프로미스 개념이 나오게 되었다.*

*아래 코드는 앞의 코드를 프로미스를 이용해서 수정한 코드이다.*

```jsx
const page1Promise = fetch(url1);
page1Promise.then((response1) => {
    return fetch(url2);
}).then((response2) => {
    return fetch(url3);
}).then((response3) => {
    // ... 
}).catch((error) => {

});
```

*async await 키워드를 활용하면 아래와 같이 나타낼 수 있다.*

```jsx
async function fetchPages() {
    const response1 = await fetch(url1);
    const response2 = await fetch(url2);
    const response3 = await fetch(url3);
    // ... 
}
```

*await 키워드는 각 프로미스가 resolve될 때까지 fetchPages 함수의 실행을 멈춘다.*

*프로미스가 reject되면 예외를 던지는데 이는 try/catch 구문으로 처리된다.*

```css
async function fetchPages() {
    try {
        const response1 = await fetch(url1);
        const response2 = await fetch(url2);
        const response3 = await fetch(url3);
        // ... 
    } catch (e) {
        // ...
    }
}
```

*타입스크립트는 런타임에 관계 없이 async/await을 사용할 수 있다.*

*이는 예전 버전이 대상이 되어도 타입스크립트 컴파일러는 async/await이 동작하도록 정교한 변환을 수행한다는 것이다.*

*다음 두 이유로 콜백보다 프로미스나 async/await을 사용해야한다.*

- *콜백보다 프로미스가 코드를 작성하기 쉽다.*
- *콜백보다 프로미스가 타입을 추론하기 쉽다.*

*병렬로 페이지를 로드하고 싶은 경우 Promise.all을 사용해서 프로미스를 조합하면 된다.*

*이때 await과 구조 분해 할당을 사용하면 좋다.*

*타입스크립트는 세 reponse 변수의 타입을 Response로 추론한다.*

```jsx
async function fetchPages() {
    const [resonse1, response2, response3] = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);
}
```

*아래 코드는 위 코드를 콜백 스타일로 변형한 코드이다.*

```jsx
function fetchPagesCB() {
    let numDone = 0;

    const responses: string[] = [];

    const done = () => {
        const [response1, response2, response3] = responses;
        // ...
    }
};

const urls = [url1, url2, url3];

urls.forEach((url, i) => {
    fetchURL(url, r => {
        responses[i] = url;
        numDone++;
        if (numDone === urls.length) done();
    })
})
```

*Promise.all뿐만 아니라 Promise.race도 타입 추론과 잘 맞는다.*

*타입 구문 없이도 아래 코드의 fetchWithTimeout의 반환 타입이 Promise<Response>로 추론된다.*

```css
function timeout(millis: number): Promise<never> {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject('timeout'), millis);
    })
}

async function fetchWithTimeout(url: string, ms: number) {
    return Promise.race([fetch(url), timeout(ms)]);
}
```

*Promise.all은 실행한 모든 프로미스의 결과값을 배열로 받는 반면, Promise.race는 가장 빨리 응답을 받은 결과값만 resolve한다.*

*하지만, 프로미스와 async/await 중 선택할 수 있다면, async/await을 사용해야한다.*

*다음은 async/await을 사용해야하는 이유이다.*

- *보통 더 간결하고 직관적인 코드가 된다.*
- *async 함수는 항상 프로미스를 반환하도록 강제된다.*

*아래 코드는 async/await을 사용한 코드이고, 그 아래 코드는 프로미스를 직접 생성하도록 작성한 코드이다.*

```jsx
// function getNumber(): Promise<number>
async function getNumber() {
    return 42;
}

// 타입이 () => Promise<number>
const getNumber = async () => 42;
```

```jsx
// 타입이 () => Promise<number>
const getNumber = () => Promise.resolve(42);
```

*함수는 항상 동기 또는 항상 비동기로 실행되어야 하고 절대 혼용해서는 안 된다.*

*아래 코드에서는 캐시된 경우 콜백 함수가 동기로 호출되기 때문에 fetchWithCache 함수를 사용하기 어렵게 된다.*

*getUser 함수 호출 시 캐시되어 있는 경우 requestStatus는 ‘success’가 되고 나서 바로 ‘loading’으로 다시 돌아가 버린다.*

```jsx
const _cache: {[url: string]: string} = {};

function fetchWithCache(url: string, callback: (text: string) => void) {
    if (url in _cache) {
        callback(_cache[url]);
    } else {
        fetchURL(url, text => {
            _cache[url] = text;
            callback(text);
        })
    }
}

let requestStatus: 'loading' | 'success' | 'error';

function getUser(userId: string) {
    fetchWithCache(`/user/${userId}`, profile => {
        requestStatus = 'success'
    });

    requestStatus = 'loading';
}
```

*async를 두 함수에 모두 사용하면 일관적인 동작을 강제한다.*

*이 경우 requestStatus가 ‘success’로 끝나게 된다.*

```jsx
const _cache: {[url: string]: string} = {};

async function fetchWithCache(url: string) {
    if (url in cache) {
        return _cache[url];
    }

    const response = await fetch(url);
    const text = await response.text();
    _cache[url] = text;

    return text;
}

let requestStatus = 'loading' | 'success' | 'error';

async function getUser(userId: string) {
    requestStatus = 'loading';

    const profile = await fetchWithCache(`/user/${useId});
    requestStatus = 'success';
}
```

*콜백이나 프로미스를 사용하는 경우 실수로 반동기 코드를 작성할 수 있지만, async를 사용하면 항상 비동기 코드를 작성하게 된다.*