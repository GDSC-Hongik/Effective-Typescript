# 타입과 값

- 타입과 값은 서로 같은 이름을 가질 수 있다.  
  따라서 언뜻 보기에는 특정 Symbol이 타입인지, 값인지 알 수 없기 때문에 의도치 않은 버그를 발생시킬 수 있다.

* 따라서 타입스크립트를 통한 리액트 개발을 했었을 때, 이러한 혼동을 피하기 위해, interface의 경우 변수 앞에 접두사 I를 붙이는 코드 컨벤션이 존재한다는 점을 다시 한 번 상기할 수 있었다.

  ```typescript
  interface IPerson {
    name: string;
    age: number;
    sex: "MALE" | "FEMALE";
  }

  const person: IPerson = {
    name: "유동하",
    age: 7,
    sex: "MALE",
  };
  ```
