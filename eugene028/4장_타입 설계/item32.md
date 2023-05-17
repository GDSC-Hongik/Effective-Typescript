# item32
유티온 타입의 속성을 가지는 인터페이스를 만들고 있다면, 인터페이스의 유니온 타입을 사용하는 것이 더욱 알맞지 않을 지 검토하는 과정이 필요하다. 
```ts
interface Layer {
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint;
}
```
이러한 타입 설계는 몇가지 이상한 점이 있다.
먼저, `layout`이 `LineLayout` 형태이면서 `paint` 속성이 `FillPaint`인 것은 말이 안된다. 이를 더 나은 형태로 모델링하려면, 타입의 계층을 분리된 인터페이스로 작성해야 한다.
```ts
interface FillLayer {
  layout: FillLayout;
  paint: FillPaint;
}
interface LineLayer {
  layout: LineLayout;
  paint: LinePaint;
}
interface PointLayer{
  layout: PointLayout;
  paint: PointPaint;
}
type Layer = FillLayer | LineLayer | PointLayer;
```
이런 형태로 인터페이스의 유니온을 사용하게 되면 잘못된 조합으로 타입이 섞이는 것을 방지할 수 있다. 이 코드는 **유효한 상태만을 표현할 수 있도록** 타입을 정의한 것과 동일하다.

## 태그된 유니온 사용하기
이러한 패턴에서 가장 많이 보일 수 있는 형태는 태그된 유니온이다. `type`을 작성하는 것이다. 
```ts
interface Layer {
  type: 'fill' | 'line' | 'point';
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint;
}
```
이렇게 작성한 뒤에 분기를 나눌 수 있다.
```ts
interface FillLayer {
  type: 'fill';
  layout: FillLayout;
  paint: FillPaint;
}
interface LineLayer {
  type: 'line';
  layout: LineLayout;
  paint: LinePaint;
}
interface PointLayer{
  type:'paint';
  layout: PointLayout;
  paint: PointPaint;
}
type Layer = FillLayer | LineLayer | PointLayer;
```
`type`속성은 태그이며, 어떤 타입의 Layer가 사용되었는지 판단하여 범위를 좁힐 때 사용될수도 있다.
```ts
function drawLayer(layer: Layer) {
  if(layer.type === 'fill'){
    const {paint} = layer;
    const {layout} = layer;
  } else if (layer.type === 'line'){
    const {paint} = layer;
    const {layout} = layer;
  } else {
    const {paint} = layer;
    const {layout} = layer;
  }
}
```
이로써 타입스크립트의 코드가 정확성을  체크하는 데 도움이 된다. 하지만 반복되는 코드가 많아 보여서 복잡해 보인다. 

이렇게 어떤 타입을 유효한 범위에서 체크하고 싶다면, **태그된 유니온으로 표현할 수 있을 때 그렇게 표현하는 것이 좋다.** 여러개의 선택적 필드가 동시에 값이 존재하거나, `undefined`인 경우에 태그된 유니온 패턴을 이용하면 문제점을 잘 해결할 수 있다.

다른 예시를 하나 더 보자.
```ts
interface Person {
  name: string;
  placeOfBirth?: string;
  dateOfBirth?: Date;
}
```
출생에 관련된 정보는 둘 다 있거나 동시에 없을 수도 있다. 그래서 두 개의 객체를 하나로 모으는 것이 더 나은 설계이다.
```ts
interface Person {
  name: string;
  birth?: {
    place: string;
    date : Date;
  }
}
```
이렇게 설계하는 것은 `null`속성을 하나로 묶어 처리하여 해당 값을 경계로 설정하는 것과 같은 효과를 가진다. 하지만, `place`만 있고, `date`가 없는 경우에는 오류가 발생한다. 그래서 해당 객체를 매개변수로 받는 함수는 해당 값이 있는지 없는지 체크하는 과정이 필요하다.
```ts
function eulogize(p: Person) {
  console.log(p.name);
  const {birth} = p;
  if(birth) {
    console.log(`was born on ${birth.date} in ${birth.place}.`);
  }
}
```
만약, 타입의 구조를 직접 손 댈 수 없는 상황이라면 인터페이스의 유니온을 사용해 보도록 하자.
```ts
interface Name {
  name: string;
}
interface PersonWithBirth extends Name{
  placeOfBirth: string;
  dateOfBirth: Date;
}
type Person = Name | PersonWithBirth;
```
이제 중첩된 객체에서도 동일한 효과를 볼 수 있다.
```ts
function eulogize(p: Person) {
  if('placeOfBirth' in p){
    p
    const {dateOfBirth} = p
    }
}
```
결론적으로 유니온 타입의 속성을 여러 개 가지는 인터페이스는 속성 관의 관계가 분명하지 않아 유효하지 않은 상황이 발생할 수 있고 실수도 발생할 수 있기 때문에 **유니온의 인터페이스보다는 인터페이스의 유니온**을 사용하는 게 더욱 정확할 수 있다. 그리고 제어 흐름을 분석하기 위하여 타입 태그를 추가하는 것도 좋은 고려사항 중의 하나이다. 