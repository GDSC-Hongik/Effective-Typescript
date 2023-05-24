# item40
# any를 항상 기피할 필요 없다.
함수의 외부와 내부, any가 하나도 없이 완벽하게 모든 타입을 정의해줄 수만 있다면 정말 좋을 것이다. 하지만, any를 모든 곳에서 완벽하게 사용하기란 정말 어려운 일이다. 이렇게 어려운 일을 별 문제 없이 완료하기 위하여 사용하는 것이 바로, **타입 단언문을 잘 작성된 함수의 타입 안에 감추는 것**이다.

이렇게 함수가 가져오는 매개변수와 반환 타입을 아래와 같이 정확히 정의했다고 하자.
```ts
declare function cacheLast<T extends Function>(fn: T): T;
```
그리고 이 함수를 실제로 구현해보자.
```ts
function cacheLast<T extends Function>(fn: T): T {
  let lastArgs: any[] | null = null;
  let lastResult: any;
  return function(...args: any[]) {
    if (!lastArgs || !shallowEqual(lastArgs, args)) {
      lastResult = fn(...args);
      lastArgs = args;
    }
    return lastResult;
  } as unknown as T;
}
```
이렇게 함수를 구현해 볼 수 있는데, 함수 안에 `any`가 많다고 해서 좋지 않은 코드라고 섣불리 판단하는 것은 올바르지 않다. 타입 단언문을 작성하였다고 하여도 반환 타입을 정확하게 사용하고 있고, 해당 함수 밖으로 잘못 쓰인 `any` 타입이 방출될 일이 없으므로 단언문을 안에 작성하여 감추는 것이 크게 힘들이지 않고 잘 작성한 코드라고 평가될 수 있는 것이다. 