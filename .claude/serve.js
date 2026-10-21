const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 8777;
const root = path.join(__dirname, '..');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  // 개발용: 접수 폼 테스트를 위한 가짜 접수처 (POST /__form)
  if (req.method === 'POST' && req.url.startsWith('/__form')) {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      console.log('[__form] ' + body);
      let no = 'GA-MOCK';
      try { no = JSON.parse(body).no || no; } catch (e) {}
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' });
      res.end(JSON.stringify({ ok: true, no: no }));
    });
    return;
  }

  // 개발용: 브라우저에서 합성한 이미지를 파일로 저장 (POST /__save?path=images/foo.webp)
  if (req.method === 'POST' && req.url.startsWith('/__save')) {
    const rel = decodeURIComponent(new URL(req.url, 'http://x').searchParams.get('path') || '');
    const out = path.join(root, rel);
    if (!rel || !out.startsWith(root)) { res.writeHead(400).end('bad path'); return; }
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      fs.writeFile(out, Buffer.concat(chunks), err => {
        if (err) { res.writeHead(500).end(String(err)); return; }
        res.writeHead(200, { 'content-type': 'text/plain' }).end('saved ' + rel);
      });
    });
    return;
  }

  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(root, rel);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'content-type': 'text/plain' }).end('404'); return; }
    res.writeHead(200, { 'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
// 127.0.0.1 에만 바인딩 — 개발용 저장 엔드포인트가 외부에 열리지 않도록
}).listen(PORT, "127.0.0.1", () => console.log("serving on http://localhost:" + PORT));
