## *아이템 5 any 타입 지양하기*

*타입스크립트의 타입 시스템은 점진적이고 선택적이다.*

*코드에 타입을 조금씩 추가할 수 있기 때문에 점진적이고 언제든지 타입 체커를 해제할 수 있기 때문에 선택적이다.*

***any 타입에는 타입 안정성이 없다.***

*아래 코드에서 age는 number 타입이지만 as any를 사용하면 string 타입을 할당할 수 있게 된다.*

```jsx
let age: number;
age = '12' as any;
age += 1;  // age는 '121'
```

***any는 함수 시그니처를 무시해버린다.***

*함수를 작성할 때는 시그니처를 명시한다.*

*이때, any 타입을 사용하면 문제가 생길 수 있다.*

*아래 코드에서 birthDate는 string이 아니라 Date 타입이어야 하지만, any 타입을 사용해서 calculateAge의 시그니처를 무시하게 된다.*

*이로 인해 다른 문제를 발생시킬 수 있다.* 

```tsx
function calculateAge(birthDate: Date): number {
    // ...
}

let birthDate: any = '1990-01-01';
calculateAge(birthDate);
```

***any 타입에는 언어 서비스가 적용되지 않는다.***

*어떤 심벌에 타입이 있으면 타입스크립트 언어 서비스는 자동 완성 기능과 이름 변경 기능,적절한 도움말을 제공하는 반면, any 타입인 심벌을 사용하면 이러한 기능을 제공 받을 수 없다.*

***any 타입은 코드 리팩터링 때 버그를 감춘다.***

*우리는 id 값만 필요하기 때문에 첫 번째 코드에서 두 번째 코드로 변경할 수 있다.*

*handleSelectItem이 any를 매개 변수로 받기 때문에 id를 전달받아도 문제가 없는 걸로 나온다.*

*이때, 타입 체커는 통과하지만 런타임에는 오류가 발생할 것이다.*

*any 대신 구체적인 타입을 사용했다면 타입 체커가 오류를 발견했을 것이다.*

```
interface ComponentProps {
    onSelectItem: (item: any) => void;
}

function renderSelector(props: ComponentProps) {}

let selectedId: number = 0;

function handleSelectItem(item: any) {
    selectedId = item.id;
}

renderSelector({ onSelectItem: handleSelectItem });
```

```jsx
interface ComponentProps {
    onSelectItem: (id: number) => void;
}

function renderSelector(props: ComponentProps) {}

let selectedId: number = 0;

function handleSelectItem(item: any) {
    selectedId = item.id;
}

renderSelector({ onSelectItem: handleSelectItem });
```

***any는 타입 설계를 감춰버린다.***

*애플리케이션 상태와 같은 객체 정의 시 속성들의 타입을 일일이 작성해야 하는데, 이때 any를 사용하면 간단히 끝낼 수 있다.*

*다만, 객체 정의 시 상태 객체의 설계를 감추기 때문에 명확한 타입을 지정해주어야 한다.*

***any는 타입 시스템의 신뢰도를 떨어뜨린다.***

*any 타입을 쓰지 않으면 런타임에 발견될 오류를 미리 잡을 수 있고 신뢰도를 높일 수 있다.*

*다만, any를 써야만 하는 상황도 있기는 하다.*