# Sunny Spotlight Runner

밝은 분위기의 2D 횡스크롤 스포트라이트 러너 게임입니다.  
정적 HTML/CSS/Canvas JavaScript만 사용하므로 별도 빌드 없이 실행하고 배포할 수 있습니다.

## Play

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:4173/`를 엽니다.

## Controls

- `Space`, `W`, `ArrowUp`: 점프
- `S`, `ArrowDown`, `Shift`: 슬라이드
- 마우스/터치: 스포트라이트 조준

## Goal

20개의 서로 다른 스테이지를 완주하세요. 스포트라이트로 숨은 적을 드러내면 콤보와 점수를 얻고, 에너지 병을 먹으면 스포트라이트 게이지가 회복됩니다.

## Deploy

이 저장소는 정적 사이트라 GitHub Pages, Netlify, Vercel 같은 정적 호스팅에 그대로 올릴 수 있습니다.  
GitHub Pages는 포함된 workflow가 `main` 브랜치에 push될 때 루트 폴더를 배포합니다.
