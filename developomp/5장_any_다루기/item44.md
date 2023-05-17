# 타입 커버리지를 추적하여 타입 안전성 유지하기

tsconfig에서 `NoImplicitAny` 설정을 활성화시켜도 이는 코드를 암시적 `any`에게로부터
지켜줄 뿐, 명시적 `any`, 혹은 라이브러리에서 오는 `any`로부터 지켜주지는 못한다.

프로젝트 내 심벌 (symbol) 중 `any`, 혹은 `any`의 멸칭이 사용된 비중과 장소를 알고 싶다면
[type-coverage](https://github.com/plantain-00/type-coverage) 등의 프로그램을
사용하도록 하자.
