# BOJ Split View

BOJ Split View는 [백준 온라인 저지(BOJ)](https://www.acmicpc.net)에서 문제를 풀 때 문제 페이지와 제출 페이지를 분할 화면으로 볼 수 있게 해주는 Chrome 확장 프로그램입니다.
탭을 전환하지 않고 **문제를 보면서 코드를 작성하고 제출**할 수 있어 더욱 편리한 문제 풀이 환경을 제공합니다.

## 주요 기능
<img width="5088" height="3356" alt="image" src="https://github.com/user-attachments/assets/7d13d3cc-844a-47b7-ad48-0fc644aaa662" />


### 1. 분할 화면 보기

- 제출 페이지에서 "문제 보기" 토글을 켜면 좌우로 화면이 분할됩니다.
- 왼쪽에는 문제 설명, 오른쪽에는 코드 제출 폼이 표시됩니다.
- 탭 전환 없이 문제를 확인하며 코드를 작성할 수 있습니다.

### 2. 화면 비율 조절

- 좌우 화면 사이의 구분선을 드래그하여 원하는 비율로 조절할 수 있습니다.
- 문제가 길거나 코드가 긴 경우 각자 편한 비율로 조정할 수 있습니다.

### 3. 상태 저장

- 분할 화면 활성화 상태가 자동으로 저장됩니다.
- 다음에 제출 페이지를 방문하면 이전 설정이 그대로 유지됩니다.

## 설치 방법

### Chrome 웹 스토어에서 설치 (권장)

1. [Chrome 웹 스토어 - BOJ Split View](#) 방문
2. "Chrome에 추가" 버튼 클릭
3. 설치 완료 후 BOJ 제출 페이지에서 사용

### 수동 설치 (개발자 모드)

1. 이 저장소를 다운로드하거나 Clone
   ```bash
   git clone https://github.com/yourusername/BOJsplit.git
   ```
2. Chrome에서 `chrome://extensions/` 접속
3. 우측 상단의 "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭
5. 다운로드한 폴더 선택

## 사용 방법

1. [백준 온라인 저지](https://www.acmicpc.net)에 로그인
2. 풀고자 하는 문제의 제출 페이지로 이동 (예: `https://www.acmicpc.net/submit/1000`)
3. 상단의 "문제 보기" 토글 스위치를 켜기
4. 분할 화면에서 문제를 보며 코드 작성 및 제출

## 권한 사용 안내

BOJ Split View는 다음 권한을 사용합니다:

- **activeTab**: 현재 열린 제출 페이지에만 확장 프로그램이 동작합니다.
- **declarativeNetRequestWithHostAccess**: 문제 페이지를 iframe에 표시하기 위해 필요한 HTTP 헤더를 수정합니다.
- **host_permissions (acmicpc.net)**: 문제 내용을 추출하여 분할 화면에 표시하기 위해 필요합니다.

모든 데이터는 사용자의 브라우저 내에서만 처리되며, 외부 서버로 전송되지 않습니다.
