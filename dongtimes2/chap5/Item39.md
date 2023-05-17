any를 사용하더라도, 최대한 구체적으로 타입을 지정할 필요가 있다.  
예를 들어 어떤 값이 들어올지 모르지만, 배열의 형태를 띄고 있다면 아래와 같이 작성하는 것이 권장된다.

```typescript
function getLengthBad(array: any) {
  return array.length; // 비권장
}
```

```typescript
function getLength(array: any[]) {
  return array.length; // 권장
}
```

함수의 타입을 지정할 때에도 다음과 같이 적용하는 것이 바람직하다.

```typescript
type Fn0 = () => any; // param 없음
type Fn1 = (arg: any) => any; // 한 개의 param
type FnN = (...args: any[]) => any; // 여러 개의 param
```
