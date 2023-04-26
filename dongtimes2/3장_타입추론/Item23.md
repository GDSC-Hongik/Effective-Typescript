# 객체 생성하기

객체를 생성할 때, 조건부로 생성하는 방법은 다음과 같다.

```typescript
declare let hasMiddle: boolean;
const firstLast = { first: "Harry", last: "Truman" };
const president = { ...firstLast, ...(hasMiddle ? { middle: "S" } : {}) };

/*
  const president: {
    middle?: string | undefined;
    first: string;
    last: string;
  }
*/
```

혹은 한 번에 여러 속성을 추가할 수 있다.

```typescript
declare let hasDates: boolean;
const nameTitle = { name: "NAME", title: "Title" };
const pharaoh = {
  ...nameTitle,
  ...(hasDates ? { start: 1111, end: 2222 } : {}),
};

/*
  const pharaoh: {
    start?: number | undefined;
    end?: number | undefined;
    name: string;
    title: string;
  }
*/
```
