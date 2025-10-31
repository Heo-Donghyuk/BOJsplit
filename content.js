(function () {
  "use strict";

  // 문제 번호 추출
  const pathMatch = window.location.pathname.match(/\/submit\/(\d+)/);
  if (!pathMatch) {
    //console.log('BOJSplit: Not a submit page');
    return;
  }

  const problemNumber = pathMatch[1];
  const problemUrl = `https://www.acmicpc.net/problem/${problemNumber}`;
  let isSplitView = false;
  const STORAGE_KEY = "bojsplit-enabled";

  // Legend에 토글 추가
  const legend = document.querySelector("legend");
  if (legend) {
    const toggleContainer = createToggleSwitch();
    legend.appendChild(toggleContainer);

    const checkbox = document.getElementById("bojsplit-toggle-checkbox");

    // 로컬스토리지에서 상태 복원
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState === "true") {
      checkbox.checked = true;
      enableSplitView();
    }

    checkbox.addEventListener("change", (e) => {
      const isChecked = e.target.checked;

      // 로컬스토리지에 상태 저장
      localStorage.setItem(STORAGE_KEY, isChecked);

      if (isChecked) {
        enableSplitView();
      } else {
        disableSplitView();
      }
    });
  }

  // === 함수 정의 ===

  function createToggleSwitch() {
    const container = document.createElement("span");
    container.id = "bojsplit-toggle-container";
    container.innerHTML = `
      <label class="bojsplit-toggle-label">
        <input type="checkbox" id="bojsplit-toggle-checkbox" />
        <span class="bojsplit-toggle-slider"></span>
        <span class="bojsplit-toggle-text">문제 보기</span>
      </label>
    `;
    return container;
  }

  function enableSplitView() {
    const targetRow = findTargetRow();
    if (!targetRow) {
      alert("제출 폼을 찾을 수 없습니다.");
      return;
    }

    // form이 포함된 col-md-12 찾기
    const formCol = targetRow.querySelectorAll(".col-md-12")[1];
    if (!formCol) {
      alert("폼 컨테이너를 찾을 수 없습니다.");
      return;
    }

    // form 컨테이너 클래스 제거 및 ID 설정
    formCol.className = "";
    formCol.id = "bojsplit-form-container";

    // 문제 표시 컬럼 생성 및 삽입 (좌측)
    const problemCol = createProblemColumn();
    targetRow.insertBefore(problemCol, formCol);

    // wrapper div로 감싸기
    const wrapper = document.createElement("div");
    wrapper.id = "bojsplit-wrapper";
    wrapper.className = "col-md-12";

    // resizer 생성
    const resizer = document.createElement("div");
    resizer.id = "bojsplit-resizer";

    // 두 컬럼을 wrapper로 이동
    targetRow.insertBefore(wrapper, problemCol);
    wrapper.appendChild(problemCol);
    wrapper.appendChild(resizer);
    wrapper.appendChild(formCol);

    // resizer 이벤트 추가
    initResizer(resizer, problemCol, formCol);

    // iframe 로드 후 콘텐츠 추출
    loadProblemContent();

    document.body.classList.add("bojsplit-active");
    isSplitView = true;
  }

  function disableSplitView() {
    const wrapper = document.getElementById("bojsplit-wrapper");
    if (!wrapper) return;

    const formContainer = document.getElementById("bojsplit-form-container");
    if (formContainer) {
      formContainer.className = "col-md-12";
      formContainer.removeAttribute("id");

      // form을 원래 위치로 복구
      wrapper.parentNode.insertBefore(formContainer, wrapper);
    }

    wrapper.remove();
    document.body.classList.remove("bojsplit-active");
    isSplitView = false;
  }

  function findTargetRow() {
    const rows = document.querySelectorAll(".row");
    for (const row of rows) {
      const cols = row.querySelectorAll(".col-md-12");
      if (cols.length >= 2) {
        return row;
      }
    }
    return null;
  }

  function createProblemColumn() {
    const col = document.createElement("div");
    col.id = "bojsplit-problem-container";
    col.innerHTML = `
      <div id="bojsplit-problem-content"></div>
      <iframe id="bojsplit-problem-iframe" src="${problemUrl}" style="display:none;"></iframe>
    `;
    return col;
  }

  function loadProblemContent() {
    const iframe = document.getElementById("bojsplit-problem-iframe");
    const contentDiv = document.getElementById("bojsplit-problem-content");

    iframe.onload = function () {
      try {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;

        // 필요한 요소들 추출
        const elements = extractProblemElements(iframeDoc);

        if (elements.length === 0) {
          showFallbackIframe(contentDiv, iframe);
          return;
        }

        // Shadow DOM 생성하여 완전한 스타일 격리
        const shadowRoot = contentDiv.attachShadow({ mode: "open" });

        // 스타일시트 복사
        copyStylesheets(iframeDoc, shadowRoot);

        // 요소들 추가
        elements.forEach((el) => {
          if (el) shadowRoot.appendChild(el.cloneNode(true));
        });

        contentDiv.style.display = "block";
      } catch (error) {
        console.error("BOJSplit: Cannot access iframe content", error);
        showFallbackIframe(contentDiv, iframe);
      }
    };
  }

  function extractProblemElements(iframeDoc) {
    const pageHeader = iframeDoc.querySelector(".page-header");
    const tableResponsive = iframeDoc.querySelector(".table-responsive");
    const problemBody =
      iframeDoc.querySelector("#problem-body") ||
      iframeDoc.querySelector("#problem_description") ||
      iframeDoc.querySelector(".problem-text");
    const problemTags = iframeDoc.querySelector("#problem_tags");

    return [pageHeader, tableResponsive, problemBody, problemTags].filter(
      Boolean
    );
  }

  function copyStylesheets(iframeDoc, shadowRoot) {
    // Shadow DOM에 스타일시트 복사
    const stylesheets = iframeDoc.querySelectorAll(
      'link[rel="stylesheet"], style'
    );
    stylesheets.forEach((styleEl) => {
      shadowRoot.appendChild(styleEl.cloneNode(true));
    });
  }

  function showFallbackIframe(contentDiv, iframe) {
    contentDiv.style.display = "none";
    iframe.style.display = "block";
  }

  function initResizer(resizer, leftPanel, rightPanel) {
    let isResizing = false;

    resizer.addEventListener("mousedown", (e) => {
      isResizing = true;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;

      const wrapper = resizer.parentElement;
      const wrapperRect = wrapper.getBoundingClientRect();
      const offsetX = e.clientX - wrapperRect.left;
      const wrapperWidth = wrapperRect.width;

      // 최소/최대 너비 제한 (10% ~ 90%)
      const minWidth = wrapperWidth * 0.1;
      const maxWidth = wrapperWidth * 0.9;

      if (offsetX >= minWidth && offsetX <= maxWidth) {
        const leftPercentage = (offsetX / wrapperWidth) * 100;
        const rightPercentage = 100 - leftPercentage;

        leftPanel.style.flex = `0 0 ${leftPercentage}%`;
        rightPanel.style.flex = `0 0 ${rightPercentage}%`;
      }
    });

    document.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    });
  }
})();
