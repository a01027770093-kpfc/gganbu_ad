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

/* 시트 첫 줄. COLUMNS 를 고치면 여기도 자동으로 따라갑니다. */
function headers_() {
  return ['접수시각', '접수번호', '종류']
    .concat(COLUMNS.map(function (c) { return c[0]; }))
    .concat(['기타', '처리상태', '원본']);
}

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

/* 자주 쓰는 항목은 칸을 따로 두고, 나머지는 "기타"에 모아 둡니다.
   왼쪽이 시트 칸 이름, 오른쪽이 폼에서 올 수 있는 항목 이름들입니다. */
const COLUMNS = [
  ['이름', ['이름']],
  ['업체명', ['업체명']],
  ['연락처', ['연락처']],
  ['플랫폼', ['플랫폼', '관심 플랫폼']],
  ['상품·항목', ['상품', '받을 체험']],
  ['수량', ['수량']],
  ['금액', ['예상 금액']],
  ['작업 주소', ['작업 주소', '체험 주소']],
  ['내용', ['문의 내용', '궁금한 점']]
];

function saveRow_(no, kind, fields, body) {
  const sh = sheet_(SETTINGS.SHEET_NAME);
  const used = {};
  const cols = COLUMNS.map(function (c) {
    let v = '';
    c[1].forEach(function (key) {
      if (!v && fields[key] && fields[key] !== '-') { v = fields[key]; used[key] = true; }
    });
    return v;
  });
  /* 위에서 쓰지 않은 항목은 전부 기타 칸에 */
  const rest = Object.keys(fields)
    .filter(function (k) { return !used[k] && fields[k] && fields[k] !== '-'; })
    .map(function (k) { return k + ': ' + fields[k]; })
    .join('\n');

  sh.appendRow([new Date(), no, kind].concat(cols, [rest, '신규', JSON.stringify(body)]));
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
  const want = headers_();
  let sh = ss.getSheetByName(name);

  /* 칸 구성이 바뀌었으면 기존 탭은 이름을 바꿔 남겨 두고 새로 만듭니다 (자료는 지우지 않습니다) */
  if (sh && sh.getLastRow() > 0) {
    const now = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].join('|');
    if (now !== want.join('|')) {
      let n = 1;
      while (ss.getSheetByName(name + '_이전' + n)) n++;
      sh.setName(name + '_이전' + n);
      sh = null;
    }
  }
  if (!sh) sh = ss.getSheetByName(name) || ss.insertSheet(name);

  if (sh.getLastRow() === 0) {
    sh.appendRow(want);
    sh.getRange(1, 1, 1, want.length).setFontWeight('bold').setBackground('#eef4ff');
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 145);  /* 접수시각 */
    sh.setColumnWidth(2, 125);  /* 접수번호 */
    sh.setColumnWidth(want.length, 60); /* 원본은 좁게 */
  }
  return sh;
}

function logError_(err, e) {
  const ss = SpreadsheetApp.openById(SETTINGS.SHEET_ID);
  const sh = ss.getSheetByName('오류') || ss.insertSheet('오류');
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
