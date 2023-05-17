우선 any와 unknown, never에 대한 타입 이해가 필요하였다

- any

  - 타입 검사를 항상 만족함
  - 의도치 않은 side-effect가 발생할 수 있음  
    (타입 진화로 인한 형변환, 의도하지 않은 타입의 값 대입)

    ```typescript
    let a: any = 123;
    let str: string = a;
    a = "123";
    a = {};
    const b = a - 123;
    ```

- unknown

  - 모든 타입을 할당할 수 있음  
     (할당한 값과 관계없이 계속해서 unknown 타입을 유지한다)

    ```typescript
    let a: unknown = 123;
    let str: string = a; // 에러
    a = "123";
    a = {};
    const b = a - 123; // 에러
    ```

- never
  - never 타입을 가지고 있을 경우 할당 불가

```typescript
let num: number;

function somethingDo(): unknown {
  return;
}

num = somethingDo(); //❌ 'unknown' 형식은 'number' 형식에 할당할 수 없습니다.

function hello(): never {
  throw new Error("xxx");
}

num = hello(); //✅

let imNever = hello();
imNever = 12; //❌ 'number' 형식은 'never' 형식에 할당할 수 없습니다
```

타입을 집합 관계로 나타냈을 때 다음과 같이 볼 수 있다.
![img](https://www.dgmunit1.com/static/0a781e445f9e1cfc78278f0222c813f0/4ad3a/type-venn-diagram.png)

unknown 타입은 타입 집합관계에 부합하는 타입이며 (가장 상위집합),  
따라서 타입의 예외로 보는 any를 사용하는 것보다 안전하다.

unknown 타입을 사용했을 때 빛을 발하는 순간은 다음과 같다.

- 어떤 값이 있지만 그 타입을 알지 못할 때
- 타입 단언, 혹은 타입 체크를 사용하도록 강제하고 싶을 때
