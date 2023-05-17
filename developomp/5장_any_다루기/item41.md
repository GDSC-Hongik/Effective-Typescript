# any의 진화를 이해하기

## 배열의 경우

```ts
const arr = []; // arr는 any[]
arr.push(0);
arr; // arr는 number[]
arr.push("");
arr; // arr는 (string | number)[]
```

## if-else 블럭의 경우

```ts
let val; // val은 any
if (Math.random() < 0.5) {
  val = "";
  val; // val은 string
} else {
  val = 12;
  val; // val은 number
}
val; // val is string | number
```
