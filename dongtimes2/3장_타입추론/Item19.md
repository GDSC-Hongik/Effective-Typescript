# 장황한 코드 방지하기

- typescript에서는 개발자가 명시적으로 타입을 지정하지 않아도 어느 정도 타입 추론을 수행해준다.  
   따라서 타입이 매우 명확한 상황에서, 굳이 타입을 지정하는 행위는 오히려 코드를 복잡하게 만들게 된다.

  ```typescript
  const age = 10;
  const age: number = 10; //bad
  ```

  위의 코드에서 age 변수는 const로 선언이 되었으므로 값이 변경될 일이 없으며, 값은 number 자료형으로 할당되었기 때문에, 굳이 타입을 지정할 필요가 없는 것이다.

- 객체 리터럴로 정의된 상황에서도 마찬가지인데, 다음과 같은 상황에서도 굳이 타입을 정의하는 행위는 오히려 거추장스러운 코드를 생성하게 된다.

  ```typescript
  const myInfo: {
    name: string;
    age: number;
    born: string;
  } = {
    name: "yudongha",
    age: 7,
    born: "Seoul",
  }; // bad

  const myInfo = {
    name: "yudongha",
    age: 7,
    born: "Seoul",
  };
  ```

- 함수의 반환 값 역시 위와 동일하다. 특정 함수가 반환하는 값이 명백하다면,
  이 또한 굳이 타입을 명시하지 않아도 타입 추론이 올바르게 작동한다.

  ```typescript
  const square = (arr: number[]) => {
    return arr.map((num) => num * num);
  };
  // 타입추론 결과 : const square: (arr: number[]) => number[]
  ```

# 타입 추론 응용

- 특정 함수의 매개변수로 객체가 들어올 때, 리펙토링이 용이하도록 코드를 짜는 법은 다음과 같다.

  ```typescript
  interface IProduct {
    id: string;
    name: string;
    price: number;
  }

  const logProduct = (product: IProduct) => {
    const id: string = product.id;
    const name: string = product.name;
    const price: number = product.price;

    console.log(id, name, price);
  }; // bad. 위와 같이 코드를 짤 경우, product 객체 원소의 타입이 변경될 경우, 에러가 발생

  // 코드 수를 줄임과 동시에, 타입 변경에도 유연하게 대처하기 위해서는 구조분해 할당을 사용한다.

  const logProduct = (product: IProduct) => {
    const { id, name, price } = product;

    console.log(id, name, price);
  };
  ```

- 타입 추론이 가능함에도 불구하고 명시적으로 타입을 지정할 때가 있는데 그 이유는 아래와 같다.

  ```typescript
  // 명시적 타입 지정을 사용하지 않는 경우 (타입 추론에 의존)

  const pencil = {
    id: 11111,
    name: "Pencil",
    price: 1000,
  };

  logProduct(pencil); // error!. id의 타입이 서로 맞지 않음 (string <-> number)
  ```

  구현의 오류가 함수를 실행하는 곳까지 영향을 미치게 된다.  
  하지만 코드를 아래와 같이 작성하면, 구현하는 부분에서 바로 타입 오류를 검출할 수 있다.

  ```typescript
  // 명시적 타입 지정을 사용한 경우

  const pencil: IProduct = {
    id: 11111, // error!. id의 타입이 서로 맞지 않음 (string <-> number)
    name: "Pencil",
    price: 1000,
  };
  ```

- 특정 변수를 객체의 key로 사용할 때에도 명시적 타입 선언이 필요하다.  
  예를 들어 다음과 같이 코드를 작성하면 에러가 발생한다.

  ```typescript
  const cache = {
    a: 11,
    b: 22,
    c: 33,
  };

  let index = "a";
  console.log(cache[index]); // error!
  // '{ a: number; b: number; c: number; }' 형식에서 'string' 형식의 매개 변수가 포함된 인덱스 시그니처를 찾을 수 없습니다.
  ```

  명시적 타입 지정을 하지 않았을 때, cache 객체의 key에 대한 타입 추론은 "a" | "b" | "c"가 된다.  
  하지만 let으로 선언된 index 변수의 타입 추론 결과는 string이므로 타입이 서로 일치하지 않게 되어 오류가 발생한 것이다.  
  따라서 cache 객체의 타입을 아래와 같이 선언해주면 된다.

  ```typescript
  const cache: { [key: string]: number } = {
    a: 11,
    b: 22,
    c: 33,
  };

  let index = "a";
  console.log(cache[index]);
  ```
