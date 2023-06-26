# devDependencies에 typescript와 @types 추가하기

Node.JS 환경에서 개발시 프로젝트 라이브러리는 `package.json` 파일을 통해 관리된다.
라이브러리 의존성은 크게 다음 세 분류로 나눌 수 있다:

- `dependencies`: 프로젝트를 실행하는데 필수적인 라이브러리
- `devDependencies`: 개발 및 테스트 단계에서는 필요하지만 런타임에는 필요 없는 라이브러리
- `peerDependencies`: 런타임에 필요하긴 하지만 의존성을 직접 관리하지는 않는 라이브러리

타입스크립트는 개발 도구일 뿐, 타입 정보는 런타임에 존재하지 않기 때문에 타입스크립트와 타입
라이브러리들은 일반적으로 `devDependencies`에 속한다.
