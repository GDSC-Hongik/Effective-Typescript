# item37
다음 코드 예시를 보자.
```ts
interface Vector2D {
  x: number;
  y: number;
}
function calculateNorm(p: Vector2D) {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}
calculateNorm({x: 3, y: 4}); 
calculateNorm({x: 3, y: 4, z: 1});
```
`calculateNorm`함수가 2차원만 받아오는 친구라면, 3차원 벡터를 허용하지 않도록 해야 한다. 그러면 타입이 아니라 값의 관점에서 받아오는 타입을 `Vertor2D`라고 표현할 필요성이 존재한다. 이 때, 공식 명칭 개념을 타입스크립트에 적용할 수 있다. 타입스크립트에는 공식 명칭 개념이 온전히 존재하는 것은 아니니까, **상표**를 붙여주면 된다. 
```ts
interface Vector2D{
  _brand: '2d';
  x: number;
  y: number;
}
function vec2D(x: number, y: number) :Vector2D {
  return {x, y, _brand:'2d'};
}
```
이렇게 설정할 경우, `calculateNorm(vec3D)`를 넣었을 때 `_brand`속성이 없다는 이유로 에러가 발생하게 된다. 

이러한 상표 기법은 **타입 시스템에서 동작**하지만, **런타임에 상표를 검사하는 것과 동일한 효과**를 얻을 수 있다. 

이는 절대 경로를 설정할 때 유용하게 사용할 수 있는데, 런타임에는 절대 경로로 시작하는지 체크하기가 쉽지만, 타입 시스템에서는 절대 경로를 판단하는 것이 어려워서 상표 기법을 사용한다.
```ts
type AbsolutePath = string & {_brand: 'abs'};
function listAbsolutePath(path: AbsolutePath) {
  //..
}
function isAbsolutePath(path:string): path is AbsolutePath {
  return path.startsWith('/');
}
```
`string`타입이면서, `_brand` 속성을 가지는 객체를 만들 수 없다. 그래서 `AbsolutePath`는 온전히 타입 시스템의 영역이라고 할 수 있다.

이렇게 상표 기법은 타입 시스템 내에서 표현할 수 없는 수많은 속성들을 모델링하는 데 사용된다. 이 친구를 이용하는 이유는, 타입 시스템에서 동작하거나 체크를 진행해야 하지만, 런타임에 상표를 검사하는 것과 동일한 효과를 얻을 수 있는 것이 장점이다.

사실 이번에 타입스크립트 공부를 하면서 **상표**라는 개념은 처음 접해 보지만, 현재 보고있는 다른 커뮤니티에 물어보면서 실무에서는 어떨 때 사용되는지 조언을 구해보고 알아봐야겠다. ㅎㅎ 일단은 먼저 아래 글을 참고해보자!
https://toss.tech/article/typescript-type-compatibility