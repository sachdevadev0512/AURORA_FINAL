const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocket, WebSocketServer } = require('ws');

const PORT = process.env.AI_PORT || 8000;
const REMOTE_AI_URL = (process.env.AI_SERVICE_URL || 'https://ai.auroratest.in').replace(/\/$/, '');
const REMOTE_WS_URL = REMOTE_AI_URL.replace(/^http/, 'ws');

const app = express();
const server = http.createServer(app);

// Parse JSON and raw body for API proxy
app.use(express.json({ limit: '50mb' }));
app.use(express.raw({ type: '*/*', limit: '50mb' }));

// 1. Static frontend
const frontendPath = path.resolve(__dirname, '../../middha-global-main/frontend');
app.use(express.static(frontendPath));

// 2. HTTP proxy for remote AI API calls
app.use(async (req, res, next) => {
  // If it's the root HTML, static handler already handled it
  if (req.path === '/' || req.path === '/index.html' || req.path === '/cogs_template.csv') {
    return next();
  }

  try {
    const targetUrl = `${REMOTE_AI_URL}${req.originalUrl}`;
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.origin;
    delete headers.referer;
    delete headers['content-length'];

    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (Buffer.isBuffer(req.body) && req.body.length > 0) {
        fetchOptions.body = req.body;
      } else if (typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        fetchOptions.body = JSON.stringify(req.body);
        headers['content-type'] = 'application/json';
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    res.status(response.status);

    response.headers.forEach((val, key) => {
      if (key !== 'content-encoding' && key !== 'transfer-encoding') {
        res.setHeader(key, val);
      }
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error('[AI Bridge Proxy Error]:', err.message);
    res.status(502).json({ error: 'AI Bridge failed to connect to remote service' });
  }
});

// 3. WebSocket proxy for /ws/chat
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  const parsedUrl = new URL(req.url, 'http://localhost');
  if (parsedUrl.pathname === '/ws/chat') {
    wss.handleUpgrade(req, socket, head, (clientWs) => {
      wss.emit('connection', clientWs, req);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (clientWs, req) => {
  const parsedUrl = new URL(req.url, 'http://localhost');
  let token = parsedUrl.searchParams.get('token');

  const subprotocolHeader = req.headers['sec-websocket-protocol'] || '';
  if (!token && subprotocolHeader) {
    const parts = subprotocolHeader.split(',').map((p) => p.trim());
    if (parts.length >= 2 && parts[0].toLowerCase() === 'bearer') {
      token = parts[1];
    }
  }

  if (!token && req.headers.authorization) {
    token = req.headers.authorization.replace(/^Bearer\s+/i, '');
  }

  const remoteUrl = `${REMOTE_WS_URL}/ws/chat`;
  const remoteProtocols = token ? ['bearer', token] : [];

  const remoteWs = new WebSocket(remoteUrl, remoteProtocols);

  remoteWs.on('open', () => {
    clientWs.on('message', (data, isBinary) => {
      if (remoteWs.readyState === WebSocket.OPEN) {
        remoteWs.send(data, { binary: isBinary });
      }
    });
  });

  remoteWs.on('message', (data, isBinary) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(data, { binary: isBinary });
    }
  });

  remoteWs.on('close', (code, reason) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.close(code, reason);
    }
  });

  remoteWs.on('error', (err) => {
    console.error('[Remote AI WS Error]:', err.message);
    clientWs.close(1011, 'Remote WS Error');
  });

  clientWs.on('close', () => {
    if (remoteWs.readyState === WebSocket.OPEN) {
      remoteWs.close();
    }
  });

  clientWs.on('error', (err) => {
    console.error('[Client WS Error]:', err.message);
    remoteWs.close();
  });
});

server.listen(PORT, () => {
  console.log(`[AI Bridge] Running on http://localhost:${PORT} -> ${REMOTE_AI_URL}`);
});

module.exports = server;
