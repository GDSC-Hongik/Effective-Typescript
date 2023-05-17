# item39
## any를 최대한 구체적으로 작성하자
## any보다는 any[]
`any`는 모든 숫자, 문자열, 배열, 객체, 정규식, 함수, 클래스, DOM엘리먼트는 물론 null과 undefined까지 포함한다. any보다는 더욱 구체적으로 표현할 수 있는 타입은 항상 존재하기 때문에, any를 작성하다고 해도 **더욱 구체적인 타입으로 세분화하여 작성하는 습관을 들이면 좋다.**
```ts
function getLengthBad(array: any){
  return array.length;
}
```
이렇게 작성하기보다는 아래와 같이 작성하도록 해보자.
```ts
function getLength(array: any[]){
  return array.length;
}
```
아래와 같이 작성하는 것이 더욱 좋은 코드이다. 그 이유를 정리해보자.
- 함수 내의 `array.length` 타입이 체크된다.
- 함수의 반환 타입이 `any` 대신 `number`로 추론된다.
- 함수가 호출될 때 매개변수가 배열인지 체크된다.

배열이 아닌 값을 넣어도 제대로 값을 체크 못하는 상황이 발생하기 때문에 같은 `any`를 쓰더라도 구체화된 값으로 사용하는 것이 낫다는 것이다.
```ts
getLangthBad(/123/)
```
해당 코드가 오류 없이 실행되는 것은 좋은 코드라고 할 수 없을 것이다.

## 객체의 타입을 잘 모를 때
```ts
[key: string]: any
```
객체에 대해서 코드를 작성할 때, 나도 <a href = "https://usecsv.com/community/react-css-modules">이렇게 코드를 작성한 적</a>이 몇 번 있다.
CSS모듈이 타입스크립트에서 잘 안통하길래 따로 type이나 인터페이스를 명시해주고 어떤 타입의 style도 받을 수 있도록 하는 것이다.
이는 어떤 변수가 객체이지만, 값을 알 수 없다면 사용하면 되고, 다른 경우에는 `Object` 타입을 이용하는 것이다. (사실 나는 이걸 더 많이 쓰는 듯?)
`Object` 타입은 객체의 키를 열거할 수는 있지만, **속성에 접근할 수 없다는 점**에서 `{[key: string]: any}`와 약간 다르다.

## 더 구체적인 any이용 with 함수
```ts
const numArgsBad = (...args: any) => args.length; //any반환
const numArgsGood = (...args: any[]) => args.length;//number반환
```
같은 `...args`라도, 배열로 설정해주냐 아니냐에 따라서 차이가 발생한다.

