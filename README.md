# 깐부애드 GGANBU AD

개발사 직속 마케팅 총판 **깐부애드** 공식 홈페이지 (정적 사이트).

## 구성

```
index.html      메인 페이지 (원페이지 구성)
css/style.css   스타일
js/app.js       상품 데이터 · 인터랙션
images/         로고 · 배너 · 플랫폼 이미지
```

## 로컬에서 보기

```bash
node .claude/serve.js
```

브라우저에서 http://localhost:8777 접속.

## 신청·문의 접수

폼 접수는 구글 시트 저장 + 텔레그램·이메일 알림으로 동작합니다.
설정 방법은 [server/README.md](server/README.md) 를 참고하세요.

- 접수 주소는 [js/app.js](js/app.js) 의 `CONFIG.formEndpoint` 한 곳에서 지정합니다.
- 설정 전에는 폼이 가짜 완료 화면 대신 카카오톡·전화 안내를 보여줍니다.

## 배포

GitHub Pages(main 브랜치 루트)로 서비스됩니다.

- 사이트: https://a01027770093-kpfc.github.io/gganbu_ad/
- main에 푸시하면 1~2분 내 자동 반영됩니다.
