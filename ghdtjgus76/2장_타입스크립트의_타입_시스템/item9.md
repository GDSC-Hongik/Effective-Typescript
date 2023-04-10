## 아이템 9 타입 단언보다는 타입 선언을 사용하기

*타입스크립트에서 변수에 값을 할당하고 타입을 부여하는 방법은 두 가지이다.*

*아래 두 방법은 결과가 같아 보이지만 다르다.*

*첫 번째 Person 타입 alice는 변수에 타입 선언을 붙여서 그 값이 선언된 타입임을 명시한다.*

*두 번째 Person 타입 bob는 타입 단언을 수행한다.*

*타입 단언의 경우 타입스크립트가 추론한 타입이 있더라도 Person 타입으로 간주한다.*

```jsx
interface Person {
    name: string;
}

const alice: Person = {
    name: 'Alice'
}

const bob = { name: 'Bob' } as Person;
```

*결론부터 말하자면, 타입 단언보다 타입 선언을 사용하는 것이 낫다.*

*타입 선언은 할당되는 값이 해당 인터페이스를 만족하는지 검사하기 때문에, 아래와 같은 코드에서 알 수 있다시피 오류를 발생시킨다.*

*타입 단언은 강제로 타입을 지정해 타입 체커에게 오류를 무시하라는 것이다.*

```jsx
const alice: Person = {};
// ~ 'Person' 유형에 필요한 'name' 속성이 '{}' 유형에 없다.

const bob = {} as Person;
// 오류 없음
```

*속성을 추가하는 경우에도 타입 선언과 타입 단언에는 차이가 있다.*

*타입 선언문에서는 잉여 속성 체크가 동작했지만 단언문에서는 적용되지 않는다.*

```jsx
const alice: Person = {
    name: 'Alice',
    occupation: 'Typescript developer'
}
// ~ 개체 리터럴은 알려진 속성만 지정할 수 있으며
// 'Person' 형식에 'occupation'이(가) 없다.

const bob = {
    name: 'Bob',
    occupation: 'Javascript developer'
} as Person;
// 오류 없음
```

*화살표 함수의 타입 선언은 추론된 타입이 모호할 때가 있다.*

*아래와 같이 타입 단언을 사용하면 런타임에 문제가 발생하게 된다.*

```tsx
const people1 = ['alice', 'bob', 'jan'].map(name => ({name}));
// Person[]를 원했지만 결과는 { name: string; }[]...

const people2 = ['alice', 'bob', 'jan'].map(name => ({name} as Person));
// 타입은 Person[]
```

```jsx
const people = ['alice', 'bob', 'jan'].map(name => ({} as Person));  // 오류 없음
```

*단언문을 사용하지 않고 화살표 함수 안에서 타입과 함께 변수를 선언하는 것이 가장 직관적이다.*

*아래 두 번째 코드에서는 (name): Person은 name의 타입이 없고 반환 타입이 Person이라고 명시한다.*

*하지만 (name: Person)은 name의 타입이 Person임을 명시하고 반환 타입은 없기 떄문에 오류가 발생한다.*

```jsx
const people = ['alice', 'bob', 'jan'].map(name => {
    const person: Person = {name};
    return person;
})
// 타입은 Person
```

```jsx
// 위 코드를 조금 더 간결하게 나타낸 코드
const people = ['alice', 'bob', 'jan'].map((name): Person => ({name}));
// 타입은 Person[]
```

*위 특징을 고려한 최종 코드는 이렇게 나타내면 된다.*

```jsx
const people: Person[] = ['alice', 'bob', 'jan'].map((name): Person => ({name}));
```

*다음은 타입 단언이 꼭 필요한 경우이다.*

*타입 단언은 타입 체커가 추론한 타입보다 우리가 판단하는 타입이 더 정확할 때 의미가 있다.*

*그 예는 DOM 엘리먼트이다.*

*타입스크립트는 DOM에 접근할 수 없어서 #myButton이 버튼 엘리먼트인지 알지 못한다.*

*또한, 이벤트의 currentTarget이 같은 버튼이어야 하는지도 알지 못한다.*

```jsx
document.querySelector('#myButton')?.addEventListener('click', e => {
    e.currentTarget;  // 타입은 EventTarget
    const button = e.currentTarget as HTMLButtonElement;
    button;  // 타입은 HTMLButtonElement
});
```

*또한, !를 사용해서 null이 아님을 단언하는 경우도 있다.*

*접미사로 쓰인 !는 그 값이 null이 아니라는 단언문으로 해석된다.*

*단언문은 컴파일 과정 중에 제거되기 때문에 타입 체커는 알지 못하지만 그 값이 null이 아니라고 확신할 수 있을 때 사용해야한다.*

*그렇지 않다면 null인 경우를 체크하는 조건문을 사용해야한다.*

```jsx
const elNull = document.getElementById('foo');  // 타입은 HTMLElement | null
const el = docuemnt.getElementById('foo')!;  // 타입은 HTMLElement
```

*타입 단언문으로 임의의 타입 간 변환은 불가능하다.*

*A가 B의 부분 집합인 경우 타입 단언문을 사용해서 변환할 수는 있다.*

*HTMLButtonElement는 EventTarget의 서브 타입이기 때문에 동작하고, Person은 {}의 서브 타입이기 때문에 동작하지만, Person과 HTMLElement는 서로의 서브 타입이 아니기 때문에 변환이 불가능하다.*

*이 경우, unknown 타입을 사용하면 되는데, 모든 타입은 unknown의 서브 타입이기 때문에 unknown이 포함된 단언문은 항상 동작한다.*

*하지만 사용하지 않는 것이 좋다.*

```jsx
const el = document.body as unknown as Person;
```