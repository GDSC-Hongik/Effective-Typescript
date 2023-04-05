## *아이템 2 타입스크립트 설정 이해하기*

*tsconfig.json 파일에서 타입스크립트 컴파일러에 대한 설정을 할 수 있다.*

*(이 파일은 tsc —init만 실행하면 생성된다.)*

```json
// tsconfig.json
{
    "compilerOptions": {
        "noImplicitAny": true
    }
}
```

*타입스크립트의 설정들은 어디서 소스 파일을 찾을지, 어떤 종류의 출력을 생성할지 제어하는 내용이 대부분이다.*

*noImplicitAny는 변수들이 미리 정의된 타입을 가져야 하는지 여부를 제어한다.*

*타입스크립트는 타입 정보를 가질 때 가장 효과적이기 때문에 되도록이면 noImplicitAny를 설정해줘야한다.*

*noImplicitAny 설정을 true로 해줬다면 아래 코드는 오류가 된다.*

*해당 오류를 고치기 위해서는 명시적으로 타입을 any로 선언해주거나 더 분명한 타입을 설정해주면 된다.*

*다만, any 타입은 주의해서 사용해야된다.*

```jsx
function add(a, b) {
	return a + b;
}
```

```jsx
function add(a: number, b: number) {
	return a + b;
}
```

*strictNullChecks는 null과 undefined가 모든 타입에서 허용되는지 확인하는 설정이다.*

*프로젝트 진행 시 strictNullChecks를 설정하는 것이 좋다.*

*strictNullChecks를 설정하기 위해서는 noImplicitAny를 먼저 설정해야한다.* 

*strictNullChecks가 설정되어 있다면, 아래 코드는 오류가 된다.*

*또한, undefined로 값을 입력해주어도 오류가 난다.*

*이 오류는 아래와 같이 표현해주면 고칠 수 있다.*

```jsx
const x: number = null;  // null 형식은 number 형식에 할당할 수 없다.
```

```jsx
const x: number | null = null;
```

*만약 null을 허용하지 않으려면, 해당 값이 어디서부터 왔는지 찾아야 하고, null을 체크하는 코드나 단언문(assertion)을 추가해야한다.*

```jsx
const el = document.getElementById('status');
el.textContent = 'Ready';

if (el) {
    el.textContent = 'Ready';
}
el!.textContent = 'Ready';
```

*noImplicitAny, strictNullChecks 등 엄격한 타입 체크를 원한다면, strict 설정을 하면 된다.*

*타입스크립트에 strict 설정을 하면 대부분의 오류를 잡아낸다.*