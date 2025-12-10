# How to run (and build)

## Node

최소 version 20 이상

## Expo

최소 version 53 이상

https://docs.expo.dev/more/expo-cli/

NOTE: 저는 pnpm start 사용함, package.json 내의 `expo start`가 실행됨

### Metro bundler 캐시 및 Expo 캐시 모두 삭제 후 시작

npx expo start --clear

### 또는 npm 스크립트로 실행 시

npm start -- --clear
