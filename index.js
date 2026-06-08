const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
  target: 'https://16.170.31.170:443',
  changeOrigin: true,
  ws: true,
  secure: false,
  xfwd: true,

  onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('Host', req.headers.host);
  },

  onError(err, req, res) {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end('Proxy error');
  }
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Reverse proxy running on ${PORT}`);
});