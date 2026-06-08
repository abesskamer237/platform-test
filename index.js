const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
  target: 'http://16.170.31.170',
  changeOrigin: true,
  ws: true
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Reverse proxy running on ${PORT}`);
});