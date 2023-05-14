# string 타입보다 더 구체적인 타입 사용하기

```ts
// 너무 넓음 👎
function setLocaleBad(locale: string) {}

// 충분히 좁음 👍
function setLocaleGood(locale: "en" | "kr") {}

// 너무 넓음 👎
function getTypeOfKeyBad(obj: any, key: string) {
  return typeof obj[key];
}

// 충분히 좁음 👍
function getTypeOfKeyGood<T>(obj: T, key: keyof T) {
  return typeof obj[key];
}
```

- 좁은 타입을 사용하면 코드 편집기 자동 완성의 기능을 더 효율적으로 사용할 수 있다
- 좁은 타입을 사용하면 런타임 에러를 방지할 수 있다
- 객체의 속성을 다룰 때는 `keyof`를 사용하자
