const http = require('http');
const httpProxy = require('http-proxy');

// Configuration
const TARGET_HOST = 2.25.160.2;   // Adresse IP de ton VPS
const TARGET_PORT = 443;            // Port où ton VPS écoute (ex: 443 pour VLESS+WS+TLS, ou 22 pour SSH over WebSocket)
const PROXY_PORT = process.env.PORT || 8080;  // Port local d'écoute (Upsun impose souvent 8080 en HTTP, mais tu peux aussi écouter en HTTPS si fourni par Upsun)

// Créer le proxy
const proxy = httpProxy.createProxyServer({
  target: {
    host: TARGET_HOST,
    port: TARGET_PORT,
    protocol: 'https:',  // Mets 'http:' si ton VPS reçoit du HTTP simple
  },
  secure: false,          // Accepte les certificats auto-signés du VPS
  changeOrigin: true,
  ws: true,               // Active la gestion des WebSockets
});

// Gérer les erreurs du proxy
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err.message);
  if (res && res.writeHead) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway');
  }
});

// Créer le serveur HTTP qui écoute les requêtes entrantes (d'Upsun)
const server = http.createServer((req, res) => {
  console.log('Proxying request:', req.method, req.url, 'Host:', req.headers.host);
  proxy.web(req, res);
});

// Gérer les upgrades WebSocket
server.on('upgrade', (req, socket, head) => {
  console.log('Proxying WebSocket upgrade:', req.url, 'Host:', req.headers.host);
  proxy.ws(req, socket, head);
});

// Démarrer le serveur
server.listen(PROXY_PORT, () => {
  console.log(`Reverse proxy listening on port ${PROXY_PORT}, forwarding to ${TARGET_HOST}:${TARGET_PORT}`);
});
