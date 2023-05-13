# 함수형 기법과 라이브러리로 타입 흐름 유지하기

자바스크립트는 파이썬이나 자바등의 언어에서 흔히 볼 수 있는 표준 라이브러리가 포함되어있지
않기 때문에 UnderscoreJS, Lodash, 그리고 최근에는 Ramda 등의 라이브러리가 사용된다.

타입스크립트에서 이러한 유틸리티 라이브러리를 사용하면 타입을 다루기 매우 간편해진다.

```ts
const students = [
  { name: "김일", gender: "male" },
  { name: "김이", gender: "male" },
  { name: "김삼", gender: "female" },
  { name: "김사", gender: "male" },
  { name: "김오", gender: "female" },
];

const data = {
  male: [
    { name: "김일", gender: "male" },
    { name: "김이", gender: "male" },
    { name: "김사", gender: "male" },
  ],
  female: [
    { name: "김삼", gender: "female" },
    { name: "김오", gender: "female" },
  ],
};
```

위 코드를 보라. 만약 라이브러리 없이 `students`에서 `data` 정보를 뽑아내고 싶다면 다음과
같이 읽기도 힘들고 타입 정보도 직접 관리해야 하는 코드를 작성하게 될 것이다.

```ts
const data = {} as any;

for (const student of students) {
  if (!data[student.gender]) {
    data[student.gender] = [];
  }

  data[student.gender].push(student);
}
```

ramda를 사용하는 경우엔 코드가 매우 간단해진다.

```ts
import R from "ramda";

const data = R.groupBy(R.prop("gender"), students);
```

더 좋은 점은 `data`의 타입이 더 이상 `any`가 아닌
`Record<string, { name: string; gender: string;}[]>`이라는 점이다.
라이브러리만 썼을 뿐인데 타입을 공짜로 얻게 되는 셈이다. 만약 `students`가
`Student[]` 타입이라면 `data`의 타입은 `Record<string, Student[]>`가 되었을 것이다.
