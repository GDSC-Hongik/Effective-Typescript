## *아이템 18 매핑된 타입을 사용하여 값을 동기화하기*

*다음과 같은 인터페이스가 있다.*

```jsx
interface ScatterProps {
    // data
    xs: number[];
    ys: number[];

    // display
    xRange: [number, number];
    yRange: [number, number];
    color: string;

    // events
    onClick: (x: number, y: number, index: number) => void;
}
```

*필요한 경우에만 차트를 다시 그릴 수 있어야 하는데, 렌더링 시마다 이벤트 핸들러 Prop이 새 화살표 함수로 설정된다.*

*해당 예에서는 이 상황을 최적화하기 위해 shouldUpdate 함수를 작성하였는데, useCallback 훅의 경우도 렌더링 시마다 새 함수를 생성하지 않도록 하는 또 다른 방법이다.*

*이 방법을 사용하면 새로운 속성 추가 시 shouldUpdate 함수는 값이 변경될 때마다 차트를 다시 그릴 것이다.*

*차트가 정확하기는 하지만 너무 자주 그려질 가능성이 있다.*

```jsx
function shouldUpdate (
    oldProps: ScatterProps,
    newProps: ScatterProps
) {
    let k: keyof ScatterProps,

    for (k in oldProps) {
        if (oldProps[k] !== newProps[k]) {
            if (k !== 'onClick') return true;
        }
    }

    return false;
}
```

*두 번째 방법은 아래와 같다.*

*해당 코드는 차트를 불필요하게 다시 그리는 단점을 해결했지만 실제로 차트를 다시 그려야할 경우 누락되는 일이 생길 수 있다.*

```jsx
function shouldUpdate (
    oldProps: ScatterProps,
    newProps: ScatterProps
) {
    return (
        oldProps.xs !== newProps.xs ||
        oldProps.ys !== newProps.ys ||
        oldProps.xRange !== newProps.xRange ||
        oldProps.yRange !== newProps.yRange ||
        oldProps.color !== newProps.color
        // no check for onClick
    )
}
```

*매핑된 타입과 객체를 사용하면 타입 체커가 동작하도록 개선할 수 있다.*

*매핑된 타입은 한 객체가 또 다른 객체와 정확히 같은 속성을 가지게 할 때 이상적이다.*

```jsx
const REQUIRES_UPDATE: {[k in keyof ScatterProps]: boolean} {
    xs: true,
    ys: true,
    xRange: true,
    yRange: true,
    color: true,
    onClick: false
};

function shouldUpdate (
    oldProps: ScatterProps,
    newProps: ScatterProps
) {
    let k: keyof ScatterProps;

    for (k in oldProps) {
        if (oldProps[k] !== newProps[k] && REQUIRES_UPDATE[k]) {
            return true;
        }
    }

    return false;
}
```