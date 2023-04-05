## *아이템 6 편집기를 사용하여 타입 시스템 탐색하기*

*타입스크립트 설치 시 타입스크립트 컴파일러(tsc), 단독으로 실행할 수 있는 타입스크립트 서버(tsserver) 두 가지를 실행할 수 있다.*

*두 기능은 언어 서비스를 제공하는데, 코드 자동 완성, 명세 검사, 검색, 리팩터링 등이 포함된다.*

*편집기를 사용하면 어떻게 타입 시스템이 동작하는지, 어떻게 타입을 추론하는지 알 수 있다.*

*아래 코드의 경우, 타입스크립트에서는 오류를 발생시킨다.*

*첫 번째 분기문에서 typeof null은 object이기 때문에 분기문 내에서 null일 가능성이 있고, 세 번째 분기문에서는 document.getElementById가 null을 반환할 가능성이 있어서 오류가 발생했다.*

*이 두 경우, null 체크를 추가하고 예외를 던져야 한다.*

```tsx
function getElement(elOrId: string | HTMLElement | null): HTMLElement {
    if (typeof elOrId === 'object') {
        return elOrId;
    } else if (elOrId === null) {
        return document.body;
    } else {
        const el = document.getElementById(elOrId);
        return el;
    }
}
```

*또한, 언어 서비스는 라이브러리와 라이브러리 타입 선언을 탐색할 때 도움이 되는데, 편집기에서 Go to Definition 옵션을 선택하면 타입스크립트에 포함되어 있는 DOM 타입 선언인 lib.dom.d.ts로 이동하게 된다.*

*이 파일을 참고하면 타입스크립트가 동작을 어떻게 모델링하는지 파악해볼 수 있다.*