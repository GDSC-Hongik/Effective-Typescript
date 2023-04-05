## *아이템 11 잉여 속성 체크의 한계 인지하기*

*타입이 명시된 변수에 객체 리터럴 할당 시 타입스크립트는 해당 타입의 속성이 있는지, 그 외의 속성은 없는지 확인한다.*

*아래 코드에서는 에러가 발생하는데, 구조적 타이핑 관점에서는 에러가 발생하지 않아야 한다.*

*이 예에서는 구조적 타입 시스템에서 발생할 수 있는 중요한 종류의 오류를 잡을 수 있도록 잉여 속성 체크가 수행되었다.*

*잉여 속성 체크는 조건에 따라 동작하지 않고, 통상적인 할당 가능 검사와 별도의 과정이라는 것을 알아야한다.*

```jsx
interface Room {
    numDoors: number;
    ceilingHeightFt: number;
}

const r: Room = {
    numDoors: 1,
    ceilingHeightFt: 10,
    elephant: 'present'
}
// ~ 개체 리터럴은 알려진 속성만 지정할 수 있으며
// 'Room' 형식에 'elephant'이(가) 없다.
```

*임시 변수를 도입해보면, obj 객체는 Room 타입에 할당이 가능하다.*

*obj의 타입은 { numDoors: number; ceilingHeightFt: number; elephant: string }으로 추론된다.*

*obj 타입은 Room 타입의 부분 집합을 포함하기 때문에 Room에 할당이 가능하고 타입 체커도 통과한다.*

```jsx
const obj = {
    numDoors: 1,
    ceilingHeightFt: 10,
    elephant: 'present'
}

const r: Room = obj;
```

*타입스크립트는 런타임에 예외를 던지는 코드뿐만 아니라 의도와 다르게 작성된 코드까지 찾으려고 한다.*

*잉여 속성 체크를 이용하면 기본적으로 타입 시스템의 구조적 본질을 해치지 않으면서도 객체 리터럴에 알 수 없는 속성을 허용하지 않는다.*

*(엄격한 리터럴 체크라고도 부른다. 다만 document나 new HTMLAnchorElement 같은 객체 리터럴이 아닌 것에는 해당하지 않는다.)*

*아래 코드의 경우 객체 리터럴이기 때문에 잉여 속성 체크가 적용이 된다.*

```jsx
interface Options {
    title: string;
    darkMode?: boolean;
}

const o: Options = {
    darkmode: true, title: 'sky'
}
// 'Options' 형식에 'darkmode'이(가) 없다.
```

*아래 코드에서는 오류가 발생하지 않는다.*

*이 경우 객체 리터럴이 아니기 때문에 잉여 속성 체크가 적용되지 않는다.*

```jsx
interface Options {
    title: string;
    darkMode?: boolean;
}

const intermediate = { darkmode: true, title: 'sky'};
const o: Options = intermediate;
```

*잉여 속성 체크는 타입 단언문 사용 시에도 적용되지 않는다.*

*따라서 아래 코드에서 오류가 발생하지 않는다.*

```jsx
const o = { darkmode: true, title: 'sky'} as Options;
```

*잉여 속성 체크를 원하지 않으면 인덱스 시그니처를 사용해서 타입스크립트가 추가적인 속성을 예상하도록 할 수 있다.*

```jsx
interface Options {
    darkMode?: boolean;
    [otherOptions: string]: unknown;
}

const o: Options = { darkmode: true };
```

*선택적 속성만 가지는 약한(weak) 타입에도 비슷한 체크가 동작한다.*

*아래 코드에서는, 구조적 관점에서 LineChartOptions 타입은 모든 속성이 선택적이라 모든 객체를 포함할 수 있다.*

*이와 같은 약한 타입에 대해서 타입스크립트는 값 타입과 선언 타입에 공통 속성이 있는지 확인하는 체크를 수행한다.*

```jsx
interface LineChartOptions {
    logscale?: boolean;
    invertedYAxis?: boolean;
    areaChart?: boolean;
}

const opts = { logScale: true };
const o: LineChartOptions = opts;
// ~ '{ logScale: boolean; }' 유형에
// 'LineChartOptions' 유형과 공통적인 속성이 없다.
```

*잉여 속성 체크는 구조적 타이핑 시스템에서 허용되는 속성 이름의 오타 같은 실수에 효과적인 방법이다.*

*다만 적용 범위가 매우 제한적이고 오직 객체 리터럴에만 적용된다.*