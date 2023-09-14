# item55
드디어 이 내용이 나왔다!!!
처음에 Storybook으로 두둥 UI 만들 때 아직 익숙하지 않았던 Typescript로 DOM 요소들을 만들려고 하니까 어색하고 배울 점도 굉장히 많았었는데, 이번 기획에 한번 더 잘 정리해보고자 한다.

드래그를 핸들링하는 핸들러 함수를 작성했다고 가정해보자.

![](https://velog.velcdn.com/images/gene028/post/8d34a6bb-e5b8-4d84-94c2-677088abde86/image.png)

자바스크립트에서는 아무 문제 없는 코드인데 타입스크립트로 넘어오니까 정말 많은 오류가 뜬다. 이것을 하나하나 디버깅하면서 왜 문제가 되는지 알아보도록 하자.
일단 이것을 디버깅 하기 전에 DOM 계층 구조를 알고 있어야 한다.

## DOM 계층의 타입
- `EventTarget` : window, XMLHttpRequest
- `Node` : document, Text, Comment
- `Element` : HTMLElement, SVGElement 포함
- `HTMLElement` : `<i>`나 `<b>` 같은 애들
- `HTMLButtonElement` ; `<button>` 같은 애들...

아래는 위 계층의 서브타입으로 판단하면 된다. 각각의 타입이 가지고 있는 메서드와 작동 방식이 다르기 때문에 내가 작성하고자 하는 각 요소가 어떤 DOM 계층의 타입에 속하는지 잘 알아보면 된다. 
`Node` 타입은 Element가 아닌 `Node`인 경우를 말하는데, 
```html
<p>
  AND <i>yet</i> it moves
  <!--quote from Galileo -->
</p>
```
이 요소를 분석해보자.
```
p.children
HTMLCollection [i]
p.childNodes
NodeList(5) [text, i, text, comment, text]
```
이렇게 결과가 나온다. `childNodes`는 엘리먼트 뿐 아니라, 텍스트 조각과 주석까지 요소로 판단한다.

`Element`와 `HTMLElement`는 명백한 차이가 존재한다.
그리고 `HTMLxxxElement`는 엘리먼트 자신만의 고유한 특성을 가지고 있다. 예를 들어서 `HTMLImageElement`에는 `src` 속성이 존재하고, `HTMLInputElement`에는 `value` 속성이 존재한다.

이제 디버깅을 시작해 보자.

## 각 요소의 정확한 타입을 찾아 줘라! 
![](https://velog.velcdn.com/images/gene028/post/83670eb3-c6f2-48a3-9f4a-0e4faff1841d/image.png)

여기서 `currentTarget` 속성의 타입은 `EventTarget | null`이다. 그렇기 때문에 연쇄적으로 `classList`에서도 오류가 생기는 것이다.
그리고 document의 요소를 가지고 오는 것으로부터에서도 오류가 발생할 수 있다.
```ts
document.getElementById('my-div');
```
해당 코드에 대한 타입을 내가 더 잘 알고 있으므로 타입 단언을 사용하여도 된다.
```ts
document.getElementById('my-div') as HTMLDivElement;
```
만약 null인 경우가 존재한다면 if 분기문으로 예상치 못한 에러를 방지해 주면 된다.

![](https://velog.velcdn.com/images/gene028/post/c2b8b44d-0703-478e-8a61-7eaefa5b88a9/image.png)

그리고 `Event`는 모든 `Event`들 중에서도 가장 추상화된 것이기 때문에 구체화가 필요한 친구이다.
- UIEvent : 모든 종류의 사용자 인터페이스 이벤트
- MouseEvent : 클릭처럼 마우스로부터 발생되는 이벤트
- TouchEvent : 모바일 기기의 터치 이벤트
- WheelEvent : 스크롤 휠을 돌려서 발생되는 이벤트
- KeyboardEvent : 키 누름 이벤트

이곳에 보다 구체적인 이벤트 타입을 지정을 해 주면 발생하는 오류를 방지할 수 있다. 인라인으로 작성해서 타입을 알아서 추론할 수 있도록 만들어 주자.
![](https://velog.velcdn.com/images/gene028/post/744c0429-574d-43da-944d-78cd186059d6/image.png)

쨔잔 이렇게 작성해보자! 이제 DOM요소 타입은 겁내지 않고 자신만만하고 당당하게 걷자. ㅋ