# 몽키 패치보다는 안전한 타입을 사용하기

자바스크립트는 런타임에서 객체와 클래스에 임의의 속성을 추가할 수 있을 만큼 유연하다는 특징을
가지고 있다. 이 점을 활용해 브라우저 환경에서 `window`나 `document`에 속성을 추가하여
전역 변수처럼 사용하기도 하는데 타입스크립트에서는 이러한 상황에서 오류가 발생한다.

```ts
document.monkey = "patching"; // ERROR
```

만약 여기서 에러를 방지하고 싶다면 `as any` 단언문, 혹은 `ts-ignore` 주석문을 사용해
오류를 무시하거나 다음 코드처럼 인터페이스를 확장해 사용할 수 있다 (더 바람직함).

```ts
declare global {
  interface Document {
    monkey: string;
  }
}

document.monkey = "patching";
```
