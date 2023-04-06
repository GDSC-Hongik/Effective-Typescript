# item15
# 1. 인덱스 시그니처를 이용하는 이유
객체가 중간에 변경될 수 있고, 새로운 프로퍼티와 메서드를 사용해야 할 수도 있다. 
특히 외부 파일에서 csv파일 같은 것을 불러와 가져오는 경우, 열의 이름이 무엇인지 미리 알 수 없다. 이럴 경우에는 인덱스 시그니처를 적극적으로 이용해 볼 수 있다.
> 인덱스 시그니처는 동적 데이터를 작성할 때 매우 유용하다.

```ts
function parseCSV(input: string): {[columnName: string]: string}[] }
	const lines = input.split('\n');
	const [header, ...rows] = lines;
	const headerColumns = header.split(',');
	return rows.map(rowStr => {
      const row: {[columnName: string]: string } = {};
      rowStr.split(',').forEach((cell, i) => {
        row[headerColumns[i]] = cell;
      });
      return row;
    });
}
```
`[columnName: string]`이 일치하기만 한다면, 인덱스 시그니처에 따라 객체가 동적으로 생성될 수 있다.
하지만 타입 체크가 실행될 때 인덱스 시그니처의 단점은 드러나게 된다.

# 2. 인덱스 시그니처 쓰기 전, 고민 한번 더!
## 1. 잘못된 키를 포함하여 모든 키를 허용한다.
의도하지 않은 프로퍼티를 사용하게 되어도 타입 체커가 오류를 잡지 못한다. 
```ts
type Rocket = {[property: string]: string};
const rocket: Rocket = {
  name: 'Falcon 9',
  variant: 'v1.0',
  thrust: '4,940KN'
});
```
여기서 `name` 대신 `Name`을 사용해도 문제가 발생하지 않는다.
## 2. 특정 키가 필요하지 않다.
`{}`도 유효한 `Rocket`의 값이 될 수 있다.
## 3. 키마다 다른 타입을 가질 수 없다.
꼭 값이 `string`이 아니라, `number`가 될 수도 있는데 이를 수정하거나 지정할 수 없다.
## 4. 자동 완성 기능을 사용할 수 없다.

## 5. undefined 체크
선언해 둔 열이 런타임에 실제로 일치한다는 보장을 할 수 없다. 그래서 `undefined`가 들어오는 것도 허락을 해 준 뒤에 이후 `undefined`를 제하는 오류 체크를 해야 한다.
```ts
function safeParseCSV(
	input: string
): {[columnName: string]: string | undefined}[] {
      return parseCSV(input);
};
```


> 정리하자면 인덱스 시그니처는 부정확하기도 하고 타입스크립트의 장점을 최대한 활용하기 어렵습니다. 그렇기 때문에 타입이 정확하게 정해져 있다면 인터페이스를 사용하는 것을 추천합니다.


# 3. 인덱스 시그니처를 사용하면 안되는 경우
어떤 타입에 가능한 필드가 제한되어 있을 경우, 인덱스 시그니처로 모델링하는 것은 좋지 않다. A, B, C, D라는 키가 정해져 있지만, 그들이 얼마나 많이 있는지 모르겠다면 아래와 같이 모델링 할 수 있다.
```ts
interface Row1 {[column: string]: number } //너무 광범위
interface Row2 { a: number; b?: number; c?: number; d?: number } //최선
type Row3 = 
	| { a: number; }
	| { a: number; b: number; }
	| { a: number; b: number; c: number; }
	| { a: number; b: number; c: number; d: number };
```

# 4. 인덱스 시그니처의 대안
## Record 사용
키 타입에 유연성을 제공하는 제너릭 타입이다.
```ts
type Vec3D = Record<'x' | 'y' | 'z', number>;
```
## 매핑된 타입 사용
매핑된 타입은 키마다 별도의 타입을 사용하게 해 준다.
```ts
type Vec3D = {[k in 'x' | 'y' | 'z' ]: number};
type ABC = {[k in 'a' | 'b' | 'c' ]: k extends 'b' ? string : number};
```
이렇게 작성하면 `b`에 대해서는 `string`과 `number` 타입을 모두 사용할 수 있다.