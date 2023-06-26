# 의존성 분리를 위해 미러 타입 사용하기

CSV 형식의 문자열 혹은 `Buffer`를 받아들여 처리하는 함수가 있다고 가정하자.
`Buffer` 타입을 사용하기 위해선 의존성에 `@types/node` 패키지를 추가해야 하는데 이를
방지하기 위해 `CsvBuffer` 인터페이스를 만들어 `Buffer` 대신 사용할 수 있다. 이 타입은
`Buffer` 타입과도 호환된다 (`CsvBuffer`가 필요한 곳에 `Buffer`를 넣어도 작동함).

```ts
interface CsvBuffer {
  toString(encoding: string): string;
}

declare function parseCSV1(
  contents: string | Buffer
): { [column: string]: string }[];

declare function parseCSV2(
  contents: string | CsvBuffer
): { [column: string]: string }[];
```
