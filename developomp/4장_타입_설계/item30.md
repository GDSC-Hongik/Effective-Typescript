# 문서에 타입 정보를 쓰지 않기

주석에 타입 정보나 변수명을 기재하면 최선의 경우에는 정보가 중복이 되고,
최악의 경우에는 정보에 모순이 발생한다. 가능한 주석보다 타입 정보를 사용하도록 하자.

<table>
    <tr>
        <td>나쁜 코드</td>
        <td>좋은 코드</td>
    </tr>
    <tr>
        <td>변수명 <code>temperature</code>, <code>time</code></td>
        <td>변수명 <code>temperatureC</code>, <code>timeMs</code></td>
    </tr>
    <tr>

<td>

```ts
/*
 * list를 변경하지 않습니다.
 */
function sort(list: number[]) {
  // ...
}
```

</td>

<td>

```ts
function sort(list: readonly number[]) {
  // ...
}
```

</td>
    </tr>
</table>
