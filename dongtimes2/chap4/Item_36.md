변수의 이름이 중요하듯 타입도 이름짓기가 매우 중요하다.
잘못된 타입 이름은 코드의 이해를 매우 떨어뜨릴 수 있다.

```typescript
interface Animal {
  name: string;
  endangered: boolean;
  habitat: string;
}

const leopard: Animal = {
  name: "Snow Leopard",
  endangered: false,
  habitat: "tundra",
};
```

사실 언듯 보기에는 타입이 괜찮아보이는데, 저자는 위 타입이 큰 오류가 있음을 말하고 있다.

- name: 동물의 이름인지, 학술명인지 알 수 없음
- endangered: 멸종위기를 bool type으로 사용한 것이 이상함
- habitat: 너무 범위가 넓은 string type이며, 뜻이 불분명함
- 또한 객체 이름은 leopard이지만 정작 name은 Snow Leopard로, 이 역시 이상함

따라서 엄밀한 타입 선언은 아래와 같이 이루어져야 한다고 저자는 주장한다.

```typescript
type ConservationStatus = "EX" | "EW" | "CR" | "EN" | "VU" | "NT" | "LC";
type KoppenClimate =
  | "Af"
  | "Am"
  | "As"
  | "Aw"
  | "BSh"
  | "BSk"
  | "BWh"
  | "BWk"
  | "Cfa"
  | "Cfb"
  | "Cfc"
  | "Csa"
  | "Csb"
  | "Csc"
  | "Cwa"
  | "Cwb"
  | "Cwc"
  | "Dfa"
  | "Dfb"
  | "Dfc"
  | "Dfd"
  | "Dsa"
  | "Dsb"
  | "Dsc"
  | "Dwa"
  | "Dwb"
  | "Dwc"
  | "Dwd"
  | "EF"
  | "ET";

interface Animal {
  commonName: string;
  genus: string;
  species: string;
  status: ConservationStatus;
  climates: KoppenClimate[];
}

const snowLeopard: Animal = {
  commonName: "Snow Leopard",
  genus: "Panthera",
  species: "Uncia",
  status: "VU",
  climates: ["ET", "EF", "Dfd"],
};
```

- ConservationStatus: 동물 보호 등급에 대한 IUCN의 표준 분류 체계를 사용함
- KoppenClimate: 퀘펜 기후구분을 이용하여 서식지라는 추상적인 개념대신, 서식기후로 엄밀하게 나타냄
- 이외에도 commonName, genus, species로 더욱 확실하게 이름을 구분함

결과적으로 변수이름 짓는 것이 매우 어렵듯, 타입이름 짓는 것도 많은 고민이 필요함을 느낄 수 있는 item이었다.

따라서 좋은 타입 네이밍이란

- 의미가 동일할 경우 굳이 다른 이름을 사용하지 않고
- 모호한 이름은 피하고
- 데이터 자체가 어떤지를 먼저 고려해야 된다.
