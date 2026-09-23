# AlpacaTools Development Guide

## Project
ALPACA TOOLS는 업무와 일상생활에 도움이 되는 웹 애플리케이션과
Windows 프로그램을 제공하는 프로젝트이다.

## General Rules
- 기존 디자인을 임의로 변경하지 않는다.
- style.css의 기존 디자인 시스템을 우선 사용한다.
- HTML/CSS/JavaScript는 별도 프레임워크 없이 작성한다.
- 모바일 반응형을 지원한다.
- 기존 기능을 삭제하지 않는다.

## Data
- apps.json은 앱 목록의 기준 데이터이다.
- notice.json은 공지사항의 기준 데이터이다.
- 앱 식별자는 apps.json의 id를 사용한다.

## Tools
- 앱 상세 페이지는 tools/{id}.html 형식을 사용한다.
- 상세 페이지가 없는 경우 repoUrl을 사용한다.

## UI
- index.html은 한 페이지에 6개 앱을 표시한다.
- tools.html은 한 페이지에 10개 앱을 표시한다.
- notice.html은 한 페이지에 10개 공지를 표시한다.

## Important
파일을 수정하기 전에 관련 HTML, JSON, CSS 구조를 확인한다.
기존 기능을 삭제하거나 임의로 변경하지 않는다.