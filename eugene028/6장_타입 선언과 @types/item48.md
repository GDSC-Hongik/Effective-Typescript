# item48
자바스크립트를 처음 공부할 때 스코프에 대한 개념을 이해하다 보면 `this`가 어떻게 바인딩되는지까지도 이해할 수 있다. 하지만 이를 처음 공부하는 사람 입장에서는 this가 동작하는 원리를 파악하기 어려울 것이다.
하지만, this의 사용은 타입스크립트에서 혼동을 줄 수 있기 때문에 이번 기회에 제대로 이해하고 어떤 정보를 가지고 있어야 하는지 확실히 해 둘 필요가 있다.

>this는 객체의 현재 인스턴스를 참조하는 클래스에서 가장 많이 쓰이고, 일반적으로, 자신을 호출한 인스턴스에 바인딩된다.

```ts
class C {
  vals = [1, 2, 3];
  logSquares() {
    for (const val of this.vals) {
      console.log(val * val);
    }
  }
}
const c = new C();
c.logSquares();
```
여기서 `logSquares`를 참조하고 있는 인스턴스는 `c`이므로, this가 가리키는 것은 `c`가 된다. 개인적으로 자바스크립트 ES6	부터 class를 추가해서 사용하는게 어색하지만 다른 사람의 코드를 이해하려면 공부는 필수적이다..(객체지향 패러다임을 따르는 것은 좋은 쪽으로 바뀐다는 생각은 맞지만, 이도 저도 아닌 짬뽕 언어가 된 느낌)

위와 같이 코드를 작성하면 `this`가 자신이 바인딩된 친구를 잘 인식하지만 아래와 같이 작성하면 오류가 발생한다.
```ts
const c = new C();
const method = c.logSquares;
method();
```
이럴 경우, `c.prototype.logSquares`를 불러오는 것과, this의 값을 c로 바인딩하는 것이 분리되어 실행되는데 참조 변수인 `method`가 끼어들어서 this가 undefined로 판단된다. 이럴 경우 call을 사용하여 명시적으로 바인딩 될 친구를 정해 주면 된다.
```ts
cosnt c = new C();
const method = c.logSquares;
method.call(c);
```
## 콜백 함수에서 쓰이는 this 바인딩
this에 대한 객체 참조는 자바스크립트에서 자주 쓰이는 것이고, 콜백 함수에(특히 이벤트 함수) this가 쓰이는 것은 많이 보았을 것이다. 하지만, 복잡한 콜백 함수에서 this를 쓴다고 하면 어떤 친구가 바인딩 되어 있는지 한번에 확인하기에는 어렵고 타입스크립트에서 작성하다보면 예기치 않게 타입 오류를 마주하게 될 수 있다.
```ts
class ResetButton {
  render() {
    return makeButton({text: 'Reset', onClick: this.onClick});
  }
  onClick() {
    alert(`Reset ${this}`);
  }
}
```
그러나 바로 onClick 함수를 호출하면 this 바인딩이 누가 되어 있는지 알아채지 못한다. 그렇기 때문에 생성자에서 this	 바인딩을 시킬 수 있는데 가장 간단한 방법은 화살표 함수를 사용하는 것이렸다.
화살표 함수는 자신이 선언될 당시의 상위 스코프의 친구가 바인딩되니 간단하게 해결할 수 있다. 
>JavaScript에서는 어떤 식별자(변수)를 찾을 때 현재 환경에서 그 변수가 없으면 바로 상위 환경을 검색합니다. 그렇게 점점 상위 환경으로 타고 타고 올라가다가 변수를 찾거나 가장 상위 환경에 도달하면 그만두게 되는 것이죠. 화살표 함수에서의 this 바인딩 방식도 이와 유사합니다. 화살표 함수에는 this라는 변수 자체가 존재하지 않기 때문에 그 상위 환경에서의 this를 참조하게 됩니다.

```ts
class ResetButton {
  render() {
    return makeButton({text: 'Reset', onClick: this.onClick});
  }
  onClick = () => {
    alert(`Reset ${this}`); //this는 항상 인스턴스 참조
  }
}
```

## 타입스크립트의 this 바인딩 관리
```ts
function addKeyListener(
	el: HTMLElement,
    fn: (this: HTMLElement, e: KeyboardEvent) => void
 ) {
      el.addEventListener('keydown', e => {
        fn.call(el, e)
    })
}
```
만약 `fn.call(el,e)`을 사용하지 않고, `fn(el, e)`와 같이 작성하게 된다면 아래와 같은 오류가 발생한다.
> 1개의 인수가 필요한데, 2개를 가져왔습니다.

그러므로 바인딩하고자 하는 친구를 명시해주는 것이 좋으며, 만약 콜백 함수의 매개변수에 this를 추가하지 않고 그냥 작성하게 된다면, this 바인딩이 체크되지 않아서 this를 깜빡해도 코드가 정상 동작해서 실수를 하게 될 수 있다.
콜백 함수에서 this를 사용하고 싶다면, 화살표 함수를 이용하면 안되며 **타입 선언**을 분명히 해 주어야 사용할 때 실수 없이 깔끔히 사용이 가능하다.

