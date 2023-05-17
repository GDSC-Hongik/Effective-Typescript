# 모르는 타입의 값에는 any 대신 unknown을 사용하기

`unknown`이 무엇인지를 요약하자면 type-safe한 `any`이다
([출처](https://github.com/Microsoft/TypeScript/pull/24439)).

`unknown` 타입은 `any` 타입과 상당 부분 비슷한데, 주요 차이점 중 하나는 어떠한 값을
`unknown`인 상태로 사용하려고 하면 오류가 발생하기 때문에 적절한 타입으로 변환하도록 강제할
수 있다는 것이다. 반환 값의 형태를 알 수 없는 함수의 반환 타입으로 사용하면 편리하다.

```ts
let vAny: any = 10; // OK
let vUnknown: unknown = 10; // OK

let s1: string = vAny; // OK
let s2: string = vUnknown; // ERROR

vAny.method(); // OK
vUnknown.method(); // ERROR
```
