# item14

개발자라면 깔끔하고 간결한 코드를 적기 위하여 `DRY(don't repeat yourself)` 원칙을 지켜야 한다. 이 부분은 타입에 대해서도 적용되며, 반복되지 않고 깔끔한 코드를 작성하기 위하여 노력해야 한다.
타입에 대한 반복을 줄일 수 있는 방법을 하나씩 알아보도록 하자.

# 1.이름 붙이기를 통한 중복 제거
```ts
function distance(a: {x:number, y:number}, b: {x: number, y: number}) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y.- b.y , 2));
};
```
반복되는 타입이 코드를 더럽게 보이게 하므로, 인터페이스를 정하고 이름을 설정해 보자.
```ts
interface Point2D {	
  x: number;
  y: number;
}
function distance(a: Point2D, b: Point2D) {/*...*/}
```
이에 대한 내용은 타입에 대한 것 뿐만 아니라 함수 시그니처에도 해당되는 말이다.
```ts
function get(url: string, opts: Options): Promise<Response>
function post(url: string, opts: Options): Promise<Response>
```	
해당 코드를 더욱 간단하게 작성할 수 있다.
```ts
type HTTPFunction = (url: string, opts: Options) => Promise<Response>
const get: HTTPFunction = (url, opts) => {/*...*/}
```
그리고 중복되는 속성은 아래와 같이 정리할 수 있다.
```ts
interface Person {
  firstName: string;
  lastName: string;
}
interface PersonWithBirthDate extends Person{
  birth: Date;
}
```
이렇게 작성하면 Person에 대한 특성을 이어받아 날짜에 대한 프로퍼티를 추가할 수 있게 된다. **부분집합을 공유하고 있다면, 공통 필드만 골라서 기반 클래스로 분리해 내는 것이다.**
또한 이미 존재하는 **타입**일 경우에는 인터섹션 연산자를 사용할 수도 있습니다.
```ts
type PersonWithBirthDate = Person & { birth: Date}
```
## 2. Pick 제네릭 타입 사용하기
```ts
interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}
```
이러한 인터페이스가 있다고 하고, 다음 인터페이스를 구성하고 싶다고 하자.
```ts
interface TopNavState {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
}
```
State의 부분 집합으로 TopNavState를 정의해볼 수 있겠다. 이 때, **State를 인덱싱하여 타입에서 중복을 제거해보자**
```ts
type TopNavState = {
  userId: State['userId'];
  pageTitle: State['pageTitle'];
  recentFiles: State['recentFiles'];
};
```
이렇게 작성해도 아직 중복은 제거된 것이 아니다. 
아래와 같이 **매핑된 타입**을 이용해 보자.
```ts
type TopNavState = {
  [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k]
};
```
매핑된 것은 배열의 필드를 루프 도는 것과 같은 방식이며, 이는 **표준 라이브러리를 통하여 코드를 개선할 수 있다.**
이것은 **Pick**이라고 한다.
```ts
type Pick<T,K> = {[k in K]: T[k]};
```
이는 정의가 완전한 것은 아니다. (오류가 발생 가능함) 그래서 이를 조금 더 명확히 작성하면 아래와 같이 작성할 수 있겠다.
```ts
type TopNavstate = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;
```
여기서 Pick은 제네릭 타입이다. 함수의 관점으로 본다면 더욱 편리하게 이해할 수 있는데, 함수처럼 두 개의 매개변수 값을 받아서 결과값을 반환하는 것이라고 이해하자.

## 3. 태그된 유니온 타입의 중복 제거
```ts
interface SaveAction {
  type: 'save';
  //...
}
interface LoadAction {
  type: 'load';
  //...
}
type Action = SaveAction | LoadAction;
type ActionType = 'save' | 'load'
```
타입을 정의하기 위한 타입에서 또한 중복이 발생하여 그닥 좋은 코드라고 할 수 없다.
그럼 아래와 같이 작성하는 것은 어떨까?
```ts
type ActionType = Action['type'];
```
해당 타입은 `save`와 `load`로 정의되어 새로운 타입이 추가되도 동적으로 추가될 수 있다. 하지만 다른 관점으로 아래와 같이 작성해보이는 것은 어떨까?
```ts
type ActionRec = Pick<Action, 'type'>;
//{type: "save" | "load"}
```
확실히 위에 정의한 `ActionType`과 다른 형식을 가지고 있다. 다른 라이브러리를 사용하였을 때 얻을 수 있는 타입의 형태도 잘 고려해야 한다.

# 4. 매핑된 타입 중복 제거하기
```ts
interface Options {
  width: number;
  height: number;
  color: string;
  label: string;
}
```

