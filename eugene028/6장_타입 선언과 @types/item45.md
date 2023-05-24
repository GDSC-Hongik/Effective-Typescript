# item45
이번 Item에서는 `devDependencies`와 `dependencies`에서 타입스크립트와 관련된 버전을 관리하는 데 있어 마주하였던 어려움에 대해서 궁금했던 점들에 대해서 알 수 있었다.
사실 typescript를 이용하면서 내가 사용하고 있는 모듈이나 라이브러리들과 버전이 맞지 않아 어려번 고생한 적이 있었기 때문에 이번 아이템은 조금 집중해서 읽어 보고 이해하려고 노력했던 것 같다.

## @types는 devDependencies에 있는 이유
프로젝트 파일의 package.json을 보면 아래와 같이 devDependencies에 @types 설치가 기록되어 있다.

![](https://velog.velcdn.com/images/gene028/post/1c3a9acf-b22b-4719-9cfb-8801eef53506/image.png)

### 왜 dependencies가 아니라 devDependencies에 있나요..?
dependencies는 현재 프로젝트를 진행하는 데 있어 필수적인 라이브러리들이 들어간다. 만약 다른 개발자가 해당 프로젝트를 클론받아 install을 진행하게 되면 dependencies에 있는 모든 패키지들이 설치될 것이다. 그러나 타입스크립트는 현재 프로젝트를 **개발하고 테스트**하는데에만 사용되고, 런타임에는 필요가 없기 때문에 `dev`를 통해 의존성을 관리해야 하는 것이다.

## 타입스크립트를 사용한다면 패키지의 의존성을 꼼꼼히 체크하도록 하자.
### 1. 타입스크립트의 자체 의존성 체크하기
타입스크립트는 시스템 레벨로 설치하는 것은 좋지 않다. (그래서 `devdependencies`에 넣는 것) 그 이유는 아래와 같다.
- 팀원들 모두가 항상 동일한 버전을 설치한다는 보장이 없음
- 프로젝트를 셋업할 때, 별도의 단계가 추가됨

하지만 이에 대해서는 내가 직접 신경쓸 필요가 없다. 사람들이 주로 사용하는 vscode나 intellij와 같은 IDE 및 빌드 도구는 타입스크립트 버전을 `devDependencies`를 통해 인식하기 때문이다.

### 2. 타입 의존성(@types)를 고려하기
사용하는 라이브러리에 타입 선언이 포함되어 있지 않더라도, <a href="https://github.com/DefinitelyTyped/DefinitelyTyped">DefinitelyTyped</a>라는 곳에서 자바스크립트 라이브러리의 타입을 유지보수하고 있기 때문에 타입 정보를 얻어보자.

만약 프로젝트를 react 라이브러리를 이용하여 진행하고 싶지만, 타입스크립트를 추가로 이용해야 한다면 `@types/react`를 이용하여 type에 대한 의존성을 관리하여 타입 정보를 얻어올 수 있도록 해야 한다.