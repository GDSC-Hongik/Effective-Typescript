# item11

참 이상한 일이다.
```ts
interface Room {
  numDoors: number;
  cdilingHeightFt: number;
}
const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
}
//객체 리터럴은 알려진 속성만 지정할 수 있으며, 'Room' 형식에 'elephant'가 없습니다.
```
된다며!!! 된다며!! 구조적 타이핑을 알고 나서 `r` 에 당연히 `Room` 타입이 지정된 것에 대하여 아무런 오류가 발생할 것이라고 생각이 들지 않는다.
그 이유는 `Room` 타입의 부분 집합을 포함하는 `r` 이 있기 때문이다.
그럼 아래 코드를 보자.
```ts
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
};
const r: Room = obj; //정상
```
해당 코드는 아무런 오류 없이 정상적으로 작동한다.
참 이상한 일이다. `obj` 타입도 `Room` 타입의 부분 집합을 포함하고 있으므로, 할당 가능하며 타입 체커도 통과한다.

이 둘의 차이점은 무엇일까?
> 객체 리터럴을 사용하고, 사용하지 않고의 차이이다.

타입스크립트는 **구조적 타이핑**으로 인하여 발생할 수 있는 오류를 잡을 수 있도록, **잉여 속성 체크**라는 과정을 제공한다. 이러한 잉여 속성 체크를 통하여 개발자는 타입스크립트를 통한 이점(!)을 얻어갈 수 있는데, **의도와 다르게 작성된 코드에 대해 에러 처리를 받음으로써 실수를 바로잡을 수 있다.**
```ts
interface Options {
  title: string;
  darkMode?: boolean;
}
function createWindow(options: Options) {
  if (options.darkMode) {
    setDarkMode();
  }
}
createWindow({
  title: 'Spider',
  darkmode: true
  //객체 리터럴은 알려진 속성만 지정할 수 있다. Options 형식에 darkmode가 없다.
});
```

Options 타입은 범위가 매우 넓다.
당장 아래 코드를 보기만 해도
```ts
const o1: Options = document;
const o2: Options = new HTMLAnchorElement;
```
모두 오류 없이 정상으로 코드가 실행된다. 그 이유는 `document`와 `HTMLAnchorElement`는 `title:string` 이라는 타입을 가지고 있어 할당하는것은 정상적으로 이루어지기 때문이다.

이렇게 할당을 통하여 구조적 타입을 통한 에러 체크를 한다면 오류를 찾아내지 못한다.
>잉여 속성 체크를 사용하면, 기본적으로 타입 시스템의 구조적 본질을 해치지 않으면서, 객체 리터럴에 알 수 없는 속성을 허용하지 않습니다.

그래서 객체에 요상한 프로퍼티가 반영되는 문제점을 미리 방지할 수 있다는 점이 중요하다. 
하지만, 객체 리터럴을 사용하지 않는 경우 잉여 속성 체크를 진행할 수 없다는 점을 알아두자..! 너무 한정적으로 쓰여서, 과연 실제 코드를 작성할 때 어떻게 적용해야 할지는 고민을 많이 해봐야 할 것 같다.

