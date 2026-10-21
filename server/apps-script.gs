/**
 * 깐부애드 접수 서버 (Google Apps Script)
 *
 * 홈페이지의 신청·문의를 구글 시트에 저장하고, 텔레그램·이메일로 알림을 보냅니다.
 * 설정 방법은 server/README.md 를 참고하세요.
 */

const SETTINGS = {
  SHEET_ID: '',           /* 접수 내역을 쌓을 구글 시트 ID (주소창 /d/ 와 /edit 사이) */
  SHEET_NAME: '접수',
  TELEGRAM_TOKEN: '',     /* @BotFather 에서 받은 봇 토큰 */
  TELEGRAM_CHAT_ID: '',   /* 알림을 받을 채팅 ID */
  EMAIL_TO: ''            /* 메일로도 받으려면 주소 입력 (비우면 보내지 않음) */
};

const HEADERS = ['접수시각', '접수번호', '종류', '연락처', '내용', '처리상태', '원본'];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const no = body.no || ('GA-' + Date.now());
    const kind = body.kind || '문의';
    const fields = body.fields || {};

    saveRow_(no, kind, fields, body);
    notify_(no, kind, fields);

    return json_({ ok: true, no: no });
  } catch (err) {
    /* 실패해도 내용은 남겨 둡니다 */
    try { logError_(err, e); } catch (ignore) {}
    return json_({ ok: false, error: String(err) });
  }
}

/* 브라우저로 열어보면 동작 여부를 확인할 수 있습니다 */
function doGet() {
  return json_({ ok: true, msg: '깐부애드 접수 서버 동작 중' });
}

function saveRow_(no, kind, fields, body) {
  const sh = sheet_(SETTINGS.SHEET_NAME);
  const text = Object.keys(fields).map(function (k) { return k + ': ' + fields[k]; }).join('\n');
  sh.appendRow([new Date(), no, kind, fields['연락처'] || '', text, '신규', JSON.stringify(body)]);
}

function notify_(no, kind, fields) {
  const lines = ['[깐부애드] ' + kind, '접수번호 ' + no, ''];
  Object.keys(fields).forEach(function (k) { lines.push('· ' + k + ': ' + fields[k]); });
  const msg = lines.join('\n');

  if (SETTINGS.TELEGRAM_TOKEN && SETTINGS.TELEGRAM_CHAT_ID) {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + SETTINGS.TELEGRAM_TOKEN + '/sendMessage', {
      method: 'post',
      payload: { chat_id: SETTINGS.TELEGRAM_CHAT_ID, text: msg, disable_web_page_preview: 'true' },
      muteHttpExceptions: true
    });
  }
  if (SETTINGS.EMAIL_TO) {
    MailApp.sendEmail(SETTINGS.EMAIL_TO, '[깐부애드] ' + kind + ' ' + no, msg);
  }
}

function sheet_(name) {
  const ss = SpreadsheetApp.openById(SETTINGS.SHEET_ID);
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function logError_(err, e) {
  const sh = sheet_('오류');
  if (sh.getLastRow() === 0) sh.appendRow(['시각', '오류', '받은 내용']);
  sh.appendRow([new Date(), String(err), e && e.postData ? e.postData.contents : '']);
}

/* ------------------------------------------------------------------
   설정이 맞는지 확인하는 함수. 편집기에서 직접 실행해 보세요.
   시트에 테스트 줄이 생기고 텔레그램·메일로 알림이 오면 정상입니다.
   ------------------------------------------------------------------ */
function 테스트() {
  const fields = { '이름': '테스트', '연락처': '010-0000-0000', '문의 내용': '설정 확인용입니다' };
  saveRow_('GA-TEST-0000', '설정 테스트', fields, { test: true });
  notify_('GA-TEST-0000', '설정 테스트', fields);
}

/* 텔레그램 채팅 ID를 모를 때: 봇에게 아무 말이나 보낸 뒤 이 함수를 실행하면
   실행 기록(Executions)에 채팅 ID가 찍힙니다. */
function 채팅ID찾기() {
  const res = UrlFetchApp.fetch('https://api.telegram.org/bot' + SETTINGS.TELEGRAM_TOKEN + '/getUpdates', { muteHttpExceptions: true });
  Logger.log(res.getContentText());
}

/* 저장이 어디로 가는지 확인하는 진단용 함수.
   편집기에서 실행한 뒤 "실행 로그"를 보면 파일 이름과 탭 목록이 나옵니다. */
function 진단() {
  const ss = SpreadsheetApp.openById(SETTINGS.SHEET_ID);
  Logger.log("파일 이름: " + ss.getName());
  Logger.log("파일 주소: " + ss.getUrl());
  ss.getSheets().forEach(function (sh) {
    Logger.log("탭 [" + sh.getName() + "] 마지막 줄 = " + sh.getLastRow());
  });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
