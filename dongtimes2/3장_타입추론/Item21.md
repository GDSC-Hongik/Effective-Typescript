# 타입 넓히기

- 타입을 명시적으로 부여하지 않은 경우 typescripts는 타입을 추론해야 되는데, 넓히기를 통해 타입을 부여하게 된다.

  아래의 코드를 살펴보자

  ```typescript
  let axis = "x";
  const vector = { x: 10, y: 20, z: 30 };
  console.log(vector[axis]); // error!.
  // '{ x: number; y: number; z: number; }' 형식에서 'string' 형식의 매개 변수가 포함된 인덱스 시그니처를 찾을 수 없습니다.
  ```

  객체 리터럴을 통해 객체가 생성되었을 때, 객체의 key 값은 정의된 값들을 기대하게 된다.  
  즉 위의 코드에서 vector 객체의 key 값의 타입은 "x" | "y" | "z"가 된다.

  하지만 axis 변수는 let으로 선언되었으며, 선언과 동시에 "x" 값으로 할당되었기 때문에 자연스럽게 axis의 타입은 "string"으로 추론된 것이다.  
  (다시말해 axis 변수는 다른 값으로 재할당이 가능한데, 맨 처음 할당된 값의 타입이 "string"이므로,  
  결과적으로 변수의 타입은 '타입 넓히기'를 통해 "x"가 아닌, "string"이 된 것이다.)

  따라서 "x" | "y" | "z" 타입이 아닌 "string" 타입이 들어왔기 때문에 에러가 발생한 것이다.

- 타입스크립트는 유연성 및 명확성 사이의 균형을 맞춰가며 타입을 추론한다.

  하지만 경우에 따라 타입을 어떻게 추론해야 되는지 모호한 경우가 발생할 수 있다.

  ```typescript
  let mix = [111, "aaa"]; // ts는 (number | string) []로 추론하였다.

  /*
    위 변수의 가능한 타입 목록
    * (111 | 'aaa')[]
    * [111, "aaa"]
    * [number | string]
    * readonly [number | string]
    * (number | string) []
    * readonly (number | string) []
    * [any | any]
    * any[]
  */
  ```

  타입을 명시적으로 부여한다면 모호한 타입을 구체적으로 잡을 수 있다.  
  구체적으로 타입을 부여하기 위한 가장 기본적인 방법은 const를 사용하는 것이다.

  아래의 코드를 보면, 변수 axis를 let이 아닌 const로 선언하였고,  
  그 결과 앞서 살펴본 코드와 다르게 오류가 발생하지 않았음을 볼 수 있다.

  const를 사용하였기 때문에 axis의 타입은 "string"이 아닌, "x"가 되었기 때문이다.

  ```typescript
  const axis = "x"; // type: "x"
  const vector = { x: 10, y: 20, z: 30 };
  console.log(vector[axis]);
  ```

  이외에도 다양한 방법을 통해 타입을 직접 조정할 수 있다.

  ```typescript
  const obj = { x: 1 }; // {x; number}
  const obj: { x: 1 | 2 | 3 } = { x: 1 }; // {x: 1 | 2 | 3}
  const obj = { x: 1 } as const; // {readonly x : 1}
  ```
