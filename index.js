const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 8888;

http.createServer((req, res) => {
  const options = {
    hostname: 16.170.31.170,
    port: 443,
    path: req.url,
    method: req.method,
    headers: req.headers,
    rejectUnauthorized: false,
  };

  const proxy = https.request(options, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });

  proxy.on('error', () => { res.writeHead(502); res.end(); });
  req.pipe(proxy);

}).listen(PORT, () => console.log('Proxy actif sur', PORT));
