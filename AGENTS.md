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
## apps.json Rules
- apps.json의 `apps` 배열은 각 항목의 `id`를 기준으로 오름차순 정렬한다.
- 정렬은 대소문자를 구분하지 않는 알파벳순으로 적용한다. ID의 대소문자 표기는 기존 값을 유지한다.
- 앱을 추가하거나 ID를 변경한 경우 배열 전체의 정렬 상태와 ID 중복 여부를 확인한다.
- 기존 앱 항목의 필드 구조를 유지한다. 현재 표준 필드는 `id`, `name`, `description`, `icon`, `category`, `platform`, `version`, `updatedAt`, `url`, `downloadUrl`, `repoUrl`, `tags`, `github`이다.
- 선택 사항이거나 해당하지 않는 URL 값은 빈 문자열 대신 `null`을 사용하고, `tags`는 배열로 유지한다.
- `updatedAt`은 `YYYY-MM-DD` 형식을 사용한다.
- 앱 ID는 상세 페이지 파일명 `tools/{id}.html` 및 관련 스크립트에서 사용하는 식별자이므로, 요청 없이 기존 ID를 변경하지 않는다.
- 수정 후 JSON 파싱, 필수 필드, 중복 ID, 날짜 형식 및 ID 오름차순을 검증한다.

## Tool Detail Pages
- 새 상세 페이지는 먼저 `tools/page-template.html`과 비슷한 완성 페이지를 확인하고, 기존 디자인과 공통 스크립트 구조를 따른다.
- 상세 페이지의 `APP_ID`는 반드시 해당 앱의 `apps.json` 항목에 있는 `id`와 정확히 일치시킨다.
- 앱 이름, 버전, 플랫폼, 실행/다운로드 주소 및 관련 공지 등 데이터가 JSON에서 동적으로 제공되는 항목은 페이지에 임의로 중복 하드코딩하지 않는다.
- 상세 페이지의 설명과 기능은 실제 앱의 코드 또는 공식 소개 자료를 확인해 작성하며, 지원하지 않는 기능이나 보안·개인정보 관련 동작을 추측해 단정하지 않는다.
- 사용자가 특정 파일만 수정하도록 지정한 경우, 관련 없는 파일(특히 `apps.json`)은 함께 변경하지 않는다.
