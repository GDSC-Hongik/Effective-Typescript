# 일관성 있는 별칭 사용하기

## 자바스크립트에서의 별칭 이해하기

자바스크립트에서는 객체 프로퍼티의 별칭(alias)을 만들어 사용할 수 있다.

```js
// 객체 생성
const obj = { arr: [0, 0, 0] };

// 별칭 생성
const arr = obj.arr;

// 별칭을 이용한 값 조작
arr[0] = 1;

// [ 1, 0, 0 ] 출력
console.log(obj.arr);
```

위 코드에서 `arr`은 `obj.arr`의 별칭이고, `arr`을 조작하면 `obj.arr`을 조작하는 것과
같은 결과를 얻게 된다.

## 타입스크립트에서의 별칭

별칭은 유용한 기능이지만 타입스크립트에서 사용시 조심해야 하는 부분이 있다.

```ts
// 타입 정의
type Data = {
  arr: number[] | undefined;
};

// 객체 생성
const data: Data = { arr: [0, 0, 0] };

// 별칭 생성
const arr = data.arr;

if (data.arr) {
  console.log(arr[0]); // 에러 발생
}
```

타입스크립트 컴파일러의 `strictNullChecks` 옵션이 활성화되었을 경우 위 코드는 if 블럭
내에서 `arr`에 접근시 `arr`가 `undefined`일 수 있기 때문에 컴파일 에러가 발생한다. 물론
실제로 에러는 존재하지 않지만 타입 체커는 `data.arr`이 truthy하다는 것을 보장할 뿐,
`arr`이 truthy할것이란 보장은 해주지 않는다.

이 때 일관성 있게 if문의 조건식에도 `arr`을 사용해준다면 컴파일 에러는 사라진다.

```ts
if (arr) {
  console.log(arr[0]); // 에러 없음
}
```

별칭을 생성할 때 비구조화를 이용하면 더 간결하고 편리하다.

```ts
const { arr } = data;
```
