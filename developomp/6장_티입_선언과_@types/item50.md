# 오버로딩 타입보다는 조건부 타입을 사용하기

`number`는 `string`으로, `string`은 `number`로 바꾸어주는 함수가 있다고 가정할 때
타입을 유니언을 사용해 정의하면 어떠한 값을 넣어도 반환값의 타입이 `string | number`인
문제가 있다. 함수 오버로딩을 사용하면 반환값의 타입이 더 정확해지지만 `string | number`
타입의 인자를 넘겨줄 수 없다는 문제가 생긴다. 반면에 조건부 타입을 사용하면 위 문제를 모두
해결할 수 있다.

```ts
// 유니언 사용
declare function flipType1(x: string | number): string | number;

// 오버로딩 사용
declare function flipType2(x: string): number;
declare function flipType2(x: number): string;

// 조건부 타입 사용
declare function flipType3<T extends string | number>(
  x: T
): T extends string ? number : string;
```
