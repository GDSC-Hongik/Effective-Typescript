# 함수 안으로 타입 단언문 감추기

타입스크립트에서 타입 단언문(특히 `any` 단언문)을 불가피하게 사용해야 하는 경우에는 함수
내부에 숨겨서 사용하고, 반활 때는 구체적인 타입을 반환하도록 하자.

예:

```ts
async function fetchData(): Promise<number> {
  const response = await fetch("some url");
  const data = await response.json();

  return data as number;
}
```
