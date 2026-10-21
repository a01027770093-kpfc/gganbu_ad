/* 깐부애드 홈페이지 동작 (단가·상품 수정은 아래 데이터 부분) */

/* ==================================================================
   운영 설정 — 여기만 바꾸면 사이트 전체에 반영됩니다
   ================================================================== */
const CONFIG = {
  phone: "1588-9097",
  openChatUrl: "https://open.kakao.com/o/s1om9Ovi",          /* ← 카카오톡 오픈채팅방 링크 (https://open.kakao.com/o/...) */
  kakaoId: "gganbu0",       /* 오픈채팅 링크가 비어 있을 때 대신 복사되는 카톡 ID */
  /* 신청·문의를 받을 주소. Google Apps Script 웹앱 URL을 넣으면 시트 저장 + 알림이 동작합니다.
     비워두면 폼 대신 카톡·전화로 안내합니다. 설정 방법은 server/README.md 참고 */
  formEndpoint: ""
};
/* 표창 사진 (data URI). 비워두면 '사진 준비 중' 표시 */

const WATERMARKS = { naver: "images/watermark-naver.webp", kakao: "images/watermark-kakao.webp", daangn: "images/watermark-daangn.webp", ably: "images/watermark-ably.webp" };
const LOGOS = {
  naver: "images/platform-naver.png", kakao: "images/platform-kakao.png",
  daangn: "images/platform-daangn.png", ably: "images/platform-ably.png"
};
const PLATFORMS = [
  { id: "naver", name: "네이버 마케팅", short: "네이버", bg: "var(--naver-bg)", c: "var(--naver)", cd: "var(--naver-dk)", price: "var(--naver-dk)", glow: "rgba(3,199,90,.22)",
    sub: "블로그 배포부터 검색 관련 상품까지",
    tag: "검색했을 때 보이는 정보, 고객의 첫인상이 됩니다.",
    lead: "블로그 배포부터 검색 관련 상품까지 개발사에서 직접 받아 공급합니다. 거래처를 옮기실 필요는 없습니다. 단가와 진행 조건만 비교해 보시고, 필요한 상품만 선택하시면 됩니다.",
    need: ["검색 노출 환경 다양화", "광고 외 추가 유입 채널 확보", "대행사 상품 구성 확장"],
    us: ["대표 직접 응대", "상품별 진행 기준 사전 안내", "기존 거래처는 그대로, 단가만 비교 가능", "7일 AS 제공"],
    note: "실명 블로그 배포는 참여자가 네이버 모바일 블로그 앱으로 작성하는 방식입니다. 상품별 세부 조건과 진행 가능 여부는 문의 시 안내드립니다." },
  { id: "kakao", name: "카카오 마케팅", short: "카카오", bg: "var(--kakao-bg)", c: "var(--kakao)", cd: "#a07f00", price: "var(--blue)", glow: "rgba(254,229,0,.45)",
    sub: "카카오맵과 채널 운영 관련 상품",
    tag: "우리 매장을 찾은 고객, 지도에서 무엇을 먼저 볼까요?",
    lead: "카카오맵과 채널 운영 관련 상품을 진행합니다. 리뷰, 친구추가, 지도 기반 상품이 필요한 업종에 적합합니다.",
    need: ["지도 기반 유입 확보", "서브 마케팅 채널 활용", "지역 노출이 중요한 업종에 효과적"],
    us: ["대표 직접 응대", "빠른 문의 대응", "신청 후 진행 구조가 명확함", "7일 AS 제공"],
    note: "운영 방식과 작업 조건을 먼저 확인하시고 진행 여부를 결정하시면 됩니다." },
  { id: "daangn", name: "당근마켓 마케팅", short: "당근", bg: "var(--daangn-bg)", c: "var(--daangn)", cd: "var(--daangn-dk)", price: "var(--daangn)", glow: "rgba(255,111,15,.22)",
    sub: "지역 중심 사업자를 위한 상품",
    tag: "전국보다, 우리 동네에서 알아주는 게 중요할 때.",
    lead: "지역 중심 사업자에게 적합한 플랫폼입니다. 병원, 학원, 음식점, 뷰티 업종과 잘 맞습니다.",
    need: ["지역 타깃 노출", "동네 기반 신뢰 형성", "병원·학원·음식점·뷰티 업종과 궁합"],
    us: ["상담부터 진행 기준까지 빠르게 안내", "지역 기반 상품 상담 가능", "기존 거래처는 그대로, 단가만 비교 가능", "7일 AS 제공"],
    note: "지역과 업종, 진행 방식에 따라 세부 조건이 달라질 수 있습니다. 문의 시 안내드립니다." },
  { id: "ably", name: "에이블리 마케팅", short: "에이블리", bg: "var(--ably-bg)", c: "var(--ably)", cd: "var(--ably-dk)", price: "var(--ably-dk)", glow: "rgba(255,79,123,.22)",
    sub: "패션·뷰티 쇼핑몰 운영 패키지",
    tag: "작은 마켓도 부담 없이 시작할 수 있는 월 패키지.",
    lead: "10대~20대 여성 타깃 쇼핑몰 운영에 맞춘 마켓 활성화 패키지입니다. 소규모 판매자도 부담 없이 시작할 수 있습니다.",
    need: ["소규모 마켓도 시작할 수 있는 합리적 예산", "스토어 활성화와 관심 신호 확보", "재판매용 패키지 상품으로 활용 가능"],
    us: ["대행사·실행사 공급 상담 가능", "패키지 구성이 단순하고 이해하기 쉬움", "빠른 문의 대응", "3일 무료체험 가능"],
    note: "세부 진행 방식과 가능 여부는 문의 시 안내드립니다." }
];
const PRODUCTS = [
  { id: "nb1", p: "naver", name: "무적권 블로그 배포", ico: "doc", sub: "매장·상품 소개 블로그 콘텐츠 배포", kind: "unit", price: 300, unit: "건", market: null, strong: true, trial: "5건 무료체험" },
  { id: "nb2", p: "naver", name: "실명 블로그 배포 (리워드 기반)", ico: "user", sub: "참여자가 네이버 모바일 블로그 앱으로 작성하는 방식", kind: "unit", price: 600, unit: "건", market: null },
  { id: "nt1", p: "naver", name: "트래픽 관련 상품", ico: "chart", sub: "유입 목적과 집계 방식 확인 후 진행", kind: "range", price: [28, 35], unit: "타", market: null },
  { id: "nm1", p: "naver", name: "함께 많이 찾는", ico: "star", sub: "키워드별 진행 가능 여부 사전 확인", kind: "monthly", price: 100000, unit: "개월", market: null },
  { id: "nm2", p: "naver", name: "자동완성어 등록", ico: "search", sub: "키워드별 진행 가능 여부 사전 확인", kind: "monthly", price: 120000, unit: "개월", market: null, strong: true },
  { id: "np1", p: "naver", name: "플레이스 마케팅", ico: "pin", sub: "매장·지역·키워드 확인 후 상담", kind: "ask", unit: "건" },
  { id: "kr1", p: "kakao", name: "카카오맵 리뷰 관련 상품", ico: "doc", sub: "카카오맵 매장 리뷰 관련 상품", kind: "unit", price: 1200, unit: "건", market: null, strong: true },
  { id: "kc1", p: "kakao", name: "카카오 플러스친구", ico: "users", sub: "카카오톡 채널 친구 추가", kind: "unit", price: 150, unit: "건", market: null },
  { id: "ks1", p: "kakao", name: "카카오맵 맛집 검색 관련 상품", ico: "pin", sub: "매장·지역·키워드 확인 후 상담", kind: "ask", unit: "건" },
  { id: "dr1", p: "daangn", name: "비즈프로필 리뷰 관련 상품", ico: "star", sub: "당근 비즈프로필 리뷰 관련 상품", kind: "unit", price: 1300, unit: "건", market: null, strong: true },
  { id: "dv1", p: "daangn", name: "동네생활 바이럴", ico: "mega", sub: "지역·업종에 맞춘 동네생활 콘텐츠", kind: "unit", price: 10000, unit: "건", market: null },
  { id: "ab1", p: "ably", name: "에이블리 마켓 활성화 패키지", ico: "bag", sub: "스토어 활성화를 위한 필수 지표 패키지", kind: "monthly", price: 100000, unit: "개월", strong: true, trial: "3일 무료체험", market: null,
    detail: [["heart", "스토어찜", "3,000개", "일 100개"], ["thumb", "상품 좋아요", "3,000개", ""], ["chart", "유입", "3,000개", ""], ["cart", "장바구니", "3,000개", ""]] }
];
const BULK = 10000;
/* ================================================================== */

const $ = s => document.querySelector(s);
const fmt = n => Math.round(n).toLocaleString("ko-KR");
const won = n => n >= 10000 && n % 10000 === 0 ? fmt(n / 10000) + "만 원" : fmt(n) + "원";
const byId = id => PRODUCTS.find(x => x.id === id);
const plat = id => PLATFORMS.find(p => p.id === id);
const chipSet = x => x.kind === "monthly" ? [1, 3, 6] : x.price >= 5000 ? [10, 30, 50, 100] : [100, 500, 1000, 5000];
const defQ = x => x.kind === "monthly" ? 1 : x.price >= 5000 ? 10 : 1000;
const stepOf = x => x.kind === "monthly" ? 1 : x.price >= 5000 ? 10 : 100;
const total = (x, q) => x.kind === "range" ? `${won(x.price[0] * q)} ~ ${won(x.price[1] * q)}` : won(x.price * q);
const unitTxt = x => x.kind === "monthly" ? `월 ${won(x.price)}` : (x.kind === "range" ? `${x.price[0]}~${x.price[1]}원` : won(x.price)) + ` / ${x.unit}`;
const qTxt = (x, q) => x.kind === "monthly" ? `${q}개월` : `${fmt(q)}${x.unit}`;
const parseQ = v => Math.max(0, parseInt(String(v).replace(/\D/g, ""), 10) || 0);
const mark = id => `<span class="mk ${id}">${LOGOS[id] ? `<img src="${LOGOS[id]}" alt="">` : ""}</span>`;
const phoneOk = v => /^01\d{8,9}$/.test(v.replace(/\D/g, ""));
const phoneFmt = el => el.addEventListener("input", () => { const d = el.value.replace(/\D/g, "").slice(0, 11); el.value = d.length < 4 ? d : d.length < 8 ? `${d.slice(0, 3)}-${d.slice(3)}` : `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`; });
const store = { get() { try { return JSON.parse(localStorage.getItem("ga_me") || "{}"); } catch (_) { return {}; } }, set(v) { try { localStorage.setItem("ga_me", JSON.stringify(v)); } catch (_) {} } };
const ICONS = {
  doc: '<path d="M7 3h7l4 4v14H7z M14 3v4h4 M10 12h5 M10 16h5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  chart: '<path d="M5 20v-7 M12 20V5 M19 20v-10"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5 M16 4.5a3.5 3.5 0 010 7 M18 14.8c1.8.7 3 2.4 3.5 5.2"/>',
  mega: '<path d="M3 10v4h4l7 5V5L7 10z M18 9a4 4 0 010 6"/>',
  bag: '<path d="M5 8h14l-1 13H6z M9 8V6a3 3 0 016 0v2"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
  thumb: '<path d="M7 11v9H4v-9z M7 11l4-8c1.5 0 2.5 1 2.2 2.6L12.6 9H19a2 2 0 012 2.3l-1.2 7A2 2 0 0117.8 20H7"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2.5l2.2 11h10.6L21 7H6.4"/>',
  gift: '<path d="M4 10h16v11H4z M3 7h18v3H3z M12 7v14 M12 7C10 3 6 4 7.5 7 M12 7c2-4 6-3 4.5 0"/>'
};
const ico = k => `<span class="ico"><svg viewBox="0 0 24 24">${ICONS[k]}</svg></span>`;
const kakaoHref = () => CONFIG.openChatUrl || "#";
const telHref = () => CONFIG.phone.replace(/\D/g, "");

/* ==================================================================
   접수 전송 — CONFIG.formEndpoint 로 POST
   ================================================================== */
const receiptNo = () => {
  const d = new Date(), z = n => String(n).padStart(2, "0");
  return "GA-" + String(d.getFullYear()).slice(2) + z(d.getMonth() + 1) + z(d.getDate()) + "-" + String(Math.floor(Math.random() * 9000) + 1000);
};
async function sendForm(kind, fields) {
  if (!CONFIG.formEndpoint) return { ok: false, reason: "unset" };
  const no = receiptNo();
  try {
    /* text/plain 으로 보내 사전 요청(preflight) 없이 바로 전송 */
    const res = await fetch(CONFIG.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ no, kind, fields, at: new Date().toISOString(), page: location.href })
    });
    if (!res.ok) return { ok: false, reason: "HTTP " + res.status };
    const out = await res.json().catch(() => null);
    if (out && out.ok === false) return { ok: false, reason: out.error || "서버 오류" };
    return { ok: true, no: (out && out.no) || no };
  } catch (e) {
    return { ok: false, reason: (e && e.message) || "네트워크 오류" };
  }
}
/* 접수처가 아직 연결되지 않았거나 전송이 실패했을 때의 안내 */
function fallbackBox(title, note) {
  return `<div class="okbox"><p style="font-weight:900;font-size:18px">${title}</p>
    <p style="color:var(--sub)">${note}</p>
    <div class="ok-acts"><a class="btn btn-kakao" data-kakao href="${kakaoHref()}" target="_blank" rel="noopener">카톡으로 접수하기</a><a class="btn btn-line" href="tel:${telHref()}">전화 ${CONFIG.phone}</a></div>
    <p class="hint">오전 10시 ~ 새벽 2시 · 주말·공휴일 포함</p></div>`;
}
function unsentNote(r) {
  return r.reason === "unset"
    ? ["지금은 카톡·전화로 접수받고 있습니다", "온라인 접수는 준비 중입니다. 아래로 연락 주시면 바로 도와드리겠습니다."]
    : ["접수가 전송되지 않았습니다", "일시적인 오류입니다(" + r.reason + "). 번거로우시겠지만 아래로 연락 주세요."];
}
async function busy(btn, label, fn) {
  const old = btn.innerHTML, w = btn.offsetWidth;
  btn.disabled = true; btn.style.minWidth = w + "px"; btn.textContent = label;
  try { return await fn(); } finally { btn.disabled = false; btn.innerHTML = old; btn.style.minWidth = ""; }
}

/* 토스트·복사·카톡 */
const toast = $("#toast"); let tt;
function show(m) { toast.textContent = m; toast.hidden = false; clearTimeout(tt); tt = setTimeout(() => toast.hidden = true, 2400); }
function copy(v, label) {
  try { navigator.clipboard.writeText(v).then(() => show(label || v + " 복사됨")).catch(() => show(v + " — 길게 눌러 복사해 주세요")); } catch (_) { show(v + " — 길게 눌러 복사해 주세요"); }
}
document.addEventListener("click", e => {
  const c = e.target.closest("[data-copy]"); if (c) { copy(c.dataset.copy); return; }
  const k = e.target.closest("[data-kakao]");
  if (k && !CONFIG.openChatUrl) { e.preventDefault(); copy(CONFIG.kakaoId, `카톡 ID ${CONFIG.kakaoId} 복사됨 · 카카오톡에서 검색해 주세요`); return; }
  if (e.target.closest("[data-signup]")) openSignup();
});
document.querySelectorAll("[data-kakao]").forEach(a => a.href = kakaoHref());

/* 메뉴 */
$("#gnbProd").innerHTML = PLATFORMS.map(p => `<li><a href="#${p.id}">${mark(p.id)}${p.name}</a></li>`).join("");
$("#mnavProd").innerHTML = PLATFORMS.map(p => `<a href="#${p.id}">${mark(p.id)}${p.name}</a>`).join("");
$("#burger").onclick = () => { const o = $("#mnav").hidden; $("#mnav").hidden = !o; $("#burger").setAttribute("aria-expanded", o); $("#burger").textContent = o ? "✕" : "☰"; };
$("#mnav").addEventListener("click", e => { if (e.target.closest("a[href^='#']:not([data-kakao])")) $("#burger").click(); });

/* 홈: 주요 상품 카드 */
$("#pgrid").innerHTML = PLATFORMS.map(p => {
  const items = PRODUCTS.filter(x => x.p === p.id);
  const body = p.id === "ably"
    ? items[0].detail.map(([, a, b]) => `<div class="r"><span>${a}</span><b class="num">${b}</b></div>`).join("") + `<div class="pk"><span>월 패키지</span><b class="num">${won(items[0].price)}</b></div>`
    : items.filter(x => x.kind !== "ask").slice(0, 3).map(x => `<div class="r"><span>${x.name.replace(/ \(.*\)/, "")}</span><b class="num">${unitTxt(x).replace(" / ", "/")}</b></div>`).join("");
  return `<a class="pcard c-${p.id}" href="#${p.id}"><div class="top">${mark(p.id)}<div><h3>${p.name}</h3><p>${p.sub}</p></div></div><div class="bd">${body}<span class="more">${p.short} 상품 전체보기</span></div></a>`;
}).join("");

/* 홈: 표창 사진 */


/* 홈: 문의 폼 */
$("#cPlat").innerHTML = PLATFORMS.map(p => `<label class="pill"><input type="checkbox" value="${p.short}"><span>${mark(p.id)}${p.short}</span></label>`).join("");
phoneFmt($("#cPhone"));
$("#cform").addEventListener("submit", async e => {
  e.preventDefault();
  const err = $("#cErr"), fail = (m, el) => { err.textContent = m; err.hidden = false; el.focus(); };
  err.hidden = true;
  if (!$("#cName").value.trim()) return fail("이름을 입력해 주세요.", $("#cName"));
  if (!phoneOk($("#cPhone").value)) return fail("연락처를 확인해 주세요. 예) 010-1234-5678", $("#cPhone"));
  if (!$("#cAgree").checked) return fail("개인정보 수집·이용에 동의해 주세요.", $("#cAgree"));
  const r = await busy(e.submitter || $("#cform button[type=submit]"), "접수 중…", () => sendForm("상담 문의", {
    "고객 유형": document.querySelector("input[name=ct]:checked").value,
    "관심 플랫폼": [...document.querySelectorAll("#cPlat input:checked")].map(i => i.value).join(", ") || "-",
    "이름": $("#cName").value.trim(),
    "업체명": $("#cCo").value.trim() || "-",
    "연락처": $("#cPhone").value,
    "문의 내용": $("#cMsg").value.trim() || "-"
  }));
  if (!r.ok) { const [t, n] = unsentNote(r); $("#cform").innerHTML = fallbackBox(t, n); return; }
  $("#cform").innerHTML = `<div class="okbox" style="align-content:center;min-height:360px"><p style="font-size:44px;line-height:1;color:var(--blue)">✓</p><p style="font-weight:900;font-size:20px">상담 신청이 접수되었습니다</p><p class="no num">${r.no}</p><p style="color:var(--sub)">입력하신 번호로 바로 연락드리겠습니다.<br>급하시면 대표 번호 <b>${CONFIG.phone}</b>로 전화 주세요.</p></div>`;
});

/* 무료체험 · 간편가입 팝업 */
function openSignup() {
  const me = store.get();
  $("#modal").innerHTML = `
    <div class="m-top"><button class="x" type="button" id="mx" aria-label="닫기">×</button>
      <span class="badge">신규 가입 혜택</span>
      <h2 id="mTitle">간편가입하시면<br>무료체험 쿠폰을 드립니다</h2>
      <div class="ticket"><div><small>FREE TRIAL COUPON</small><b>블로그 배포 5건 <span style="color:var(--muted);font-weight:500">또는</span><br>에이블리 활성화 3일</b></div><div>무료</div></div>
    </div>
    <div class="m-body" id="mBody">
      <div class="sns">
        <button class="k" type="button" data-sns="카카오">카카오로 3초 만에 가입</button>
        <button class="n" type="button" data-sns="네이버">네이버로 가입</button>
        <button class="g" type="button" data-sns="구글">구글로 가입</button>
      </div>
      <p class="or">또는 휴대폰 번호로 가입</p>
      <div><span class="lbl">받으실 무료체험</span><div class="radio2">
        <label><input type="radio" name="tr" value="nb1" checked><span><b>블로그 배포</b>5건 무료</span></label>
        <label><input type="radio" name="tr" value="ab1"><span><b>에이블리 활성화</b>3일 무료</span></label>
      </div></div>
      <div class="g2"><div><label class="lbl" for="mCo">업체명 <span class="req">*</span></label><input class="inp" id="mCo" value="${me.co || ""}" autocomplete="organization"></div>
        <div><label class="lbl" for="mPhone">휴대폰 <span class="req">*</span></label><input class="inp" id="mPhone" type="tel" inputmode="numeric" placeholder="010-0000-0000" value="${me.phone || ""}" autocomplete="tel"></div></div>
      <label class="agree"><input type="checkbox" id="mAg1"><span>[필수] 이용약관 및 개인정보 수집·이용 동의</span></label>
      <label class="agree"><input type="checkbox" id="mAg2"><span>[선택] 신규 상품·할인 소식 받기</span></label>
      <p class="err" id="mErr" hidden></p>
      <button class="btn btn-blue" type="button" id="mGo" style="height:50px;font-size:15px">가입하고 쿠폰 받기</button>
      <p class="hint" style="text-align:center">신규 고객 1회 · 상품별 진행 가능 여부 확인 후 제공</p>
    </div>`;
  $("#dim").hidden = false; document.body.style.overflow = "hidden";
  phoneFmt($("#mPhone"));
  $("#mx").onclick = closeModal;
  $("#modal").querySelectorAll("[data-sns]").forEach(b => b.onclick = () => show(`${b.dataset.sns} 간편가입은 준비 중입니다. 아래 휴대폰 번호로 신청해 주세요`));
  $("#mGo").onclick = async () => {
    const err = $("#mErr"), fail = (m, el) => { err.textContent = m; err.hidden = false; el.focus(); };
    err.hidden = true;
    const co = $("#mCo").value.trim(), phone = $("#mPhone").value;
    if (!co) return fail("업체명을 입력해 주세요.", $("#mCo"));
    if (!phoneOk(phone)) return fail("휴대폰 번호를 확인해 주세요.", $("#mPhone"));
    if (!$("#mAg1").checked) return fail("필수 약관에 동의해 주세요.", $("#mAg1"));
    store.set({ co, phone });
    const x = byId(document.querySelector("input[name=tr]:checked").value);
    const r = await busy($("#mGo"), "신청 중…", () => sendForm("무료체험 신청", {
      "받을 체험": x.name.replace(/ \(.*\)/, "") + " · " + x.trial,
      "업체명": co,
      "연락처": phone,
      "소식 수신": $("#mAg2").checked ? "동의" : "미동의"
    }));
    if (!r.ok) { const [t, n] = unsentNote(r); $("#mBody").innerHTML = fallbackBox(t, n); return; }
    $("#mBody").innerHTML = `<div class="okbox"><p style="font-weight:900;font-size:19px">신청이 접수되었습니다</p>
      <p class="no num">${r.no}</p>
      <p style="color:var(--sub)">${x.name.replace(/ \(.*\)/, "")} · ${x.trial}</p>
      <div style="width:100%;text-align:left"><label class="lbl" for="mUrl">체험할 주소 (URL) <span style="color:var(--muted);font-weight:500">· 지금 알려주시면 더 빠릅니다</span></label><input class="inp" id="mUrl" type="url" inputmode="url" placeholder="https://"></div>
      <p class="err" id="mErr2" hidden></p>
      <button class="btn btn-blue" type="button" id="mGo2" style="width:100%;height:48px">주소 보내기</button>
      <button class="btn btn-line btn-sm" type="button" onclick="closeModal()">나중에 알려드릴게요</button></div>`;
    $("#mGo2").onclick = async () => {
      if (!/^https?:\/\/\S+\.\S+/.test($("#mUrl").value.trim())) { $("#mErr2").textContent = "주소를 https:// 로 시작하게 입력해 주세요."; $("#mErr2").hidden = false; return; }
      const r2 = await busy($("#mGo2"), "전송 중…", () => sendForm("무료체험 주소", {
        "접수번호": r.no, "업체명": co, "연락처": phone, "체험 주소": $("#mUrl").value.trim()
      }));
      if (!r2.ok) { const [t, n] = unsentNote(r2); $("#mBody").innerHTML = fallbackBox(t, n); return; }
      $("#mBody").innerHTML = `<div class="okbox"><p style="font-weight:900;font-size:19px">무료체험 신청 완료</p><p class="no num">${r.no}</p><p style="color:var(--sub)">확인 후 입력하신 번호로 연락드립니다.</p><button class="btn btn-line" type="button" onclick="closeModal()">닫기</button></div>`;
    };
  };
  setTimeout(() => $("#mx").focus(), 30);
}
function closeModal() { $("#dim").hidden = true; document.body.style.overflow = ""; }
$("#dim").addEventListener("click", e => { if (e.target.id === "dim") closeModal(); });
addEventListener("keydown", e => { if (e.key === "Escape" && !$("#dim").hidden) closeModal(); });

/* 상품 페이지 */
const sel = {};
let curP = null, curItem = null;
function chipsHTML(x, q) {
  return chipSet(x).map(n => `<button class="chip" type="button" data-p="${x.id}" data-q="${n}" aria-pressed="${curItem === x && n === q}"><span class="q">${qTxt(x, n)}</span><span class="t num">${total(x, n)}</span></button>`).join("")
    + (x.kind === "monthly" ? "" : `<a class="chip" data-kakao href="${kakaoHref()}" target="_blank" rel="noopener"><span class="q">1만 ${x.unit} 이상</span><span class="t">단가 문의</span></a>`);
}
function priceHTML(x) {
  const mk = x.market == null ? "" : typeof x.market === "number" ? `<span class="mkp">시장 평균 <s>${won(x.market)}</s></span>` : `<span class="mkp">${x.market}</span>`;
  const v = x.kind === "monthly" ? `월 ${won(x.price)}` : x.kind === "range" ? `${x.price[0]}~${x.price[1]}원` : won(x.price);
  return `<p class="pp"><b class="num">${v}</b><small>${x.kind === "monthly" ? "" : "/ " + x.unit}</small>${mk}</p>`;
}
function rowHTML(x) {
  const tag = x.strong ? `<span class="tag">강점</span>` : "";
  const info = `<div class="info"><h4>${x.name}${tag}</h4><p class="sub">${x.sub || ""}</p></div>`;
  if (x.kind === "ask") return `<div class="prow">${ico(x.ico)}${info}<p class="pp"><b style="color:var(--blue);font-size:19px">별도 문의</b></p><a class="askbtn" data-kakao href="${kakaoHref()}" target="_blank" rel="noopener">카톡으로 문의 →</a></div>`;
  const q = sel[x.id] ?? defQ(x); sel[x.id] = q;
  if (x.detail) {
    return `<div class="pkg" id="row-${x.id}">
      <div class="pkg-h">${ico(x.ico)}<div><h4>${x.name}</h4><p class="sub">${x.sub}</p></div><p class="pp"><b class="num">월 ${fmt(x.price)}원</b><small>/ 30일</small></p></div>
      <div class="pkg-b"><h5>패키지 구성</h5>
        <div class="tiles">${x.detail.map(([i, a, b, c]) => `<div class="tile">${ico(i)}<div><span>${a}</span><b class="num">${b}</b>${c ? `<small>${c}</small>` : ""}</div></div>`).join("")}</div>
        <h5>이용 기간 선택</h5><div class="period">${chipsHTML(x, q)}</div></div></div>`;
  }
  return `<div class="prow${curItem === x ? " sel" : ""}" id="row-${x.id}">${ico(x.ico)}${info}${priceHTML(x)}<div class="chips">${chipsHTML(x, q)}</div></div>`;
}
function renderList() { $("#pvList").innerHTML = PRODUCTS.filter(v => v.p === curP).map(rowHTML).join(""); }
function renderProd(pid) {
  const p = plat(pid); curP = pid;
  const page = $("#pageProd");
  [["--pbg", p.bg], ["--pc", p.c], ["--pcd", p.cd], ["--pprice", p.price], ["--pglow", p.glow]].forEach(([k, v]) => page.style.setProperty(k, v));
  $("#pvCrumb").textContent = p.name;
  $("#pvTitle").innerHTML = `${mark(pid)}${p.name}`;
  $("#pvTag").textContent = p.tag;
  $("#pvLead").textContent = p.lead;
  $("#pvArt").innerHTML = mark(pid);
  $("#pvWm").src = WATERMARKS[pid];
  $("#ptabs").innerHTML = PLATFORMS.map(t => `<a class="ptab t-${t.id}${t.id === pid ? " on" : ""}" href="#${t.id}" ${t.id === pid ? 'aria-current="page"' : ""}>${mark(t.id)}${t.short}</a>`).join("");
  $("#pvWhy").innerHTML = `<div><h3><svg viewBox="0 0 24 24">${ICONS.chart}</svg>왜 필요한가</h3><ul>${p.need.map(s => `<li>${s}</li>`).join("")}</ul></div>
    <div><h3><svg viewBox="0 0 24 24" class="b">${ICONS.users}</svg>왜 깐부애드인가</h3><ul>${p.us.map(s => `<li>${s}</li>`).join("")}</ul></div>`;
  const isAbly = pid === "ably";
  $("#pvListTitle").textContent = isAbly ? "운영 상품 · 패키지" : "운영 상품 · 대행사 단가";
  $("#pvListSub").textContent = isAbly ? "핵심 지표를 한 번에, 월 패키지로." : "모두 대행사·실행사 단가입니다. 수량을 누르면 금액이 바뀝니다.";
  $("#pvNote").textContent = p.note;
  $("#pvLinks").innerHTML = isAbly ? `<div class="links">
      <button class="lk" type="button" data-signup>${ico("gift")}<span><b>3일 무료체험 받기</b><small>간편가입하면 에이블리 활성화 3일 무료체험 쿠폰을 드립니다.</small></span></button>
      <a class="lk" data-kakao href="${kakaoHref()}" target="_blank" rel="noopener">${ico("users")}<span><b>대행사·실행사 재판매 상담</b><small>마케팅 대행사·실행사를 위한 공급 상담이 가능합니다.</small></span></a></div>` : "";
  const items = PRODUCTS.filter(x => x.p === pid && x.kind !== "ask");
  if (!curItem || curItem.p !== pid) curItem = items[0];
  $("#pickMark").innerHTML = mark(pid);
  $("#pickList").innerHTML = items.map(x => `<li><button type="button" role="option" data-pick="${x.id}">${ico(x.ico)}<span><b>${x.name}</b><small>${unitTxt(x)}</small></span><span class="ck">✓</span></button></li>`).join("");
  $("#oForm").hidden = false; $("#oDone").hidden = true;
  renderList(); syncBox();
}
$("#pvList").addEventListener("click", e => {
  const c = e.target.closest(".chip[data-q]"); if (!c) return;
  const x = byId(c.dataset.p); sel[x.id] = +c.dataset.q; curItem = x;
  const sx = c.parentElement.scrollLeft;
  renderList();
  const ch = $(`#row-${x.id} .chips`); if (ch) ch.scrollLeft = sx;
  syncBox();
});
function syncBox() {
  const x = curItem, q = sel[x.id] ?? defQ(x); sel[x.id] = q;
  $("#pickName").textContent = x.name;
  $("#pickPrice").textContent = unitTxt(x);
  $("#pickList").querySelectorAll("[data-pick]").forEach(b => b.setAttribute("aria-selected", b.dataset.pick === x.id));
  $("#oUnit").textContent = unitTxt(x);
  const m = x.kind === "monthly";
  $("#oQtyRow").hidden = m; $("#oPerRow").hidden = !m;
  if (m) $("#oPer").innerHTML = [1, 3, 6].map(n => `<button type="button" data-per="${n}" aria-pressed="${n === q}">${n}개월</button>`).join("");
  else { $("#oQtyLbl").textContent = `수량 (${x.unit})`; $("#oQty").value = fmt(q); }
  $("#oTotal").textContent = q ? total(x, q) : "—";
  $("#oHint").hidden = !(q >= BULK && !m);
  $("#mbName").textContent = `${x.name} · ${qTxt(x, q)}`;
  $("#mbTotal").textContent = q ? total(x, q) : "—";
}
function oSet(n) { sel[curItem.id] = Math.max(0, n); renderList(); syncBox(); }
function togglePick(open) { $("#pickList").hidden = !open; $("#pickBtn").setAttribute("aria-expanded", open); }
$("#pickBtn").onclick = () => togglePick($("#pickList").hidden);
$("#pickList").addEventListener("click", e => { const b = e.target.closest("[data-pick]"); if (!b) return; curItem = byId(b.dataset.pick); togglePick(false); renderList(); syncBox(); });
document.addEventListener("click", e => { if (!e.target.closest("#pick")) togglePick(false); });
$("#oPer").addEventListener("click", e => { const b = e.target.closest("[data-per]"); if (b) oSet(+b.dataset.per); });
$("#oMinus").onclick = () => oSet(sel[curItem.id] - stepOf(curItem));
$("#oPlus").onclick = () => oSet(sel[curItem.id] + stepOf(curItem));
$("#oQty").onchange = () => oSet(parseQ($("#oQty").value));
$("#mbGo").onclick = () => $("#obox").scrollIntoView({ behavior: "smooth", block: "start" });
phoneFmt($("#oPhone"));
(() => { const me = store.get(); if (me.co) { $("#oCo").value = me.co; $("#oPhone").value = me.phone || ""; $("#oAgree").checked = true; } })();
$("#obox").addEventListener("submit", async e => {
  e.preventDefault();
  const err = $("#oErr"), fail = (m, el) => { err.textContent = m; err.hidden = false; el.focus(); };
  err.hidden = true;
  const x = curItem, q = sel[x.id], co = $("#oCo").value.trim(), phone = $("#oPhone").value;
  if (!q) return fail("수량을 입력해 주세요.", $("#oQty"));
  if (!/^https?:\/\/\S+\.\S+/.test($("#oUrl").value.trim())) return fail("작업할 주소를 https:// 로 시작하게 입력해 주세요.", $("#oUrl"));
  if (!co) return fail("업체명을 입력해 주세요.", $("#oCo"));
  if (!phoneOk(phone)) return fail("연락처를 확인해 주세요. 예) 010-1234-5678", $("#oPhone"));
  if (!$("#oAgree").checked) return fail("개인정보 수집·이용에 동의해 주세요.", $("#oAgree"));
  store.set({ co, phone });
  const r = await busy(e.submitter || $("#obox button[type=submit]"), "접수 중…", () => sendForm("상품 신청", {
    "플랫폼": plat(x.p).name,
    "상품": x.name,
    "수량": qTxt(x, q),
    "예상 금액": total(x, q),
    "작업 주소": $("#oUrl").value.trim(),
    "업체명": co,
    "연락처": phone
  }));
  $("#oForm").hidden = true; $("#oDone").hidden = false;
  if (!r.ok) {
    const [t, n] = unsentNote(r);
    $("#oDone").innerHTML = fallbackBox(t, n + "<br><b>" + x.name + " · " + qTxt(x, q) + " · " + total(x, q) + "</b>");
  } else {
    $("#oDone").innerHTML = `<div class="okbox"><p style="font-weight:900">신청이 접수되었습니다</p><p class="no num">${r.no}</p><p>${x.name} · ${qTxt(x, q)} · ${total(x, q)}</p>
      <p class="pay"><b>결제 안내</b><br>확인 연락 때 계좌이체 정보를 안내드립니다. 입금 확인 후 바로 진행합니다.</p>
      <button class="btn btn-blue btn-sm" type="button" data-copy="${r.no}">신청번호 복사</button></div>`;
  }
  $("#obox").scrollIntoView({ behavior: "smooth", block: "start" });
});

/* 창업교육 */
$("#acImg").src = "images/hero-office.webp";
phoneFmt($("#aPhone"));
$("#aform").addEventListener("submit", async e => {
  e.preventDefault();
  const err = $("#aErr"), fail = (m, el) => { err.textContent = m; err.hidden = false; el.focus(); };
  err.hidden = true;
  if (!$("#aName").value.trim()) return fail("이름을 입력해 주세요.", $("#aName"));
  if (!phoneOk($("#aPhone").value)) return fail("연락처를 확인해 주세요. 예) 010-1234-5678", $("#aPhone"));
  if (!$("#aAgree").checked) return fail("개인정보 수집·이용에 동의해 주세요.", $("#aAgree"));
  const r = await busy(e.submitter || $("#aform button[type=submit]"), "접수 중…", () => sendForm("창업교육 문의", {
    "이름": $("#aName").value.trim(),
    "연락처": $("#aPhone").value,
    "현재 상황": document.querySelector("input[name=as]:checked").value,
    "궁금한 점": $("#aMsg").value.trim() || "-"
  }));
  if (!r.ok) { const [t, n] = unsentNote(r); $("#aform").innerHTML = fallbackBox(t, n); return; }
  $("#aform").innerHTML = `<div class="okbox" style="min-height:280px;align-content:center"><p style="font-size:40px;line-height:1;color:var(--blue)">✓</p><p style="font-weight:900;font-size:19px">교육 문의가 접수되었습니다</p><p class="no num">${r.no}</p><p style="color:var(--sub)">확인 후 입력하신 번호로 연락드리겠습니다.</p></div>`;
});

/* 페이지 전환 */
function route() {
  const h = location.hash.slice(1) || "home";
  const isProd = PLATFORMS.some(p => p.id === h), isGuide = h === "guide", isAc = ["academy", "ac-form", "ac-curri"].includes(h);
  $("#pageHome").hidden = isProd || isGuide || isAc; $("#pageProd").hidden = !isProd; $("#pageGuide").hidden = !isGuide; $("#pageAcademy").hidden = !isAc;
  document.body.classList.toggle("has-mbar", isProd);
  document.body.classList.toggle("has-dock", !isProd);
  $("#mdock").hidden = isProd;
  const navKey = isProd ? "prod" : isAc ? "academy" : isGuide ? "guide" : ["about", "contact"].includes(h) ? h : "home";
  document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === navKey));
  if (isProd) { renderProd(h); scrollTo(0, 0); }
  else if (isGuide || h === "home" || h === "academy") scrollTo(0, 0);
  else { const el = document.getElementById(h); if (el) setTimeout(() => el.scrollIntoView(), 60); }
}
addEventListener("hashchange", route);
route();

/* 이미지 크게 보기 */
const lbox = $("#lbox");
function openLbox(src, alt) {
  const im = $("#lboxImg");
  im.src = src; im.alt = alt || "";
  lbox.hidden = false; lbox.classList.remove("zoom");
  document.body.classList.add("lbox-on");
  $("#lboxX").focus();
}
function closeLbox() { lbox.hidden = true; document.body.classList.remove("lbox-on"); }
document.addEventListener("click", e => {
  const z = e.target.closest("[data-zoom]");
  if (z) { const im = z.querySelector("img"); openLbox(z.dataset.zoom, im && im.alt); return; }
  if (lbox.hidden) return;
  if (e.target.closest("#lboxX") || e.target === lbox || e.target === $("#lboxBody")) { closeLbox(); return; }
  if (e.target.closest("#lboxImg")) lbox.classList.toggle("zoom");
});
addEventListener("keydown", e => { if (e.key === "Escape" && !lbox.hidden) closeLbox(); });
