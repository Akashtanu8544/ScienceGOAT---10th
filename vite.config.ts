import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import http from 'http';
import https from 'https';
import { URL } from 'url';

interface ProxyJobState {
  jobId: string;
  url: string;
  status: 'connecting' | 'fetching' | 'success' | 'error';
  strategy: string;
  message: string;
  timestamp: number;
}

const proxyJobStore = new Map<string, ProxyJobState>();

function pdfProxyPlugin(): Plugin {
  return {
    name: 'pdf-proxy-plugin',
    configureServer(server) {
      // 1. Status Polling Endpoint: /api/pdf-proxy-status?jobId=...
      server.middlewares.use('/api/pdf-proxy-status', (req, res) => {
        const reqUrl = new URL(req.url || '', `http://${req.headers.host}`);
        const jobId = reqUrl.searchParams.get('jobId');

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');

        if (!jobId || !proxyJobStore.has(jobId)) {
          res.statusCode = 404;
          res.end(JSON.stringify({ status: 'unknown', message: 'Job not found' }));
          return;
        }

        const jobState = proxyJobStore.get(jobId)!;
        res.statusCode = 200;
        res.end(JSON.stringify(jobState));
      });

      // 2. Proxy Gateway Endpoint: /api/pdf-proxy?url=...&jobId=...&head=...
      server.middlewares.use('/api/pdf-proxy', async (req, res) => {
        const timestamp = new Date().toISOString();
        const reqUrl = new URL(req.url || '', `http://${req.headers.host}`);
        const targetUrl = reqUrl.searchParams.get('url');
        const jobId = reqUrl.searchParams.get('jobId') || `job_${Date.now()}`;
        const isHeadRequest = reqUrl.searchParams.get('head') === 'true' || req.method === 'HEAD';

        console.log(`\n[PDF PROXY LOG ${timestamp}] Request received for: ${targetUrl || 'NONE'} (Job: ${jobId})`);

        if (!targetUrl) {
          console.error(`[PDF PROXY ERROR ${timestamp}] Missing 'url' query parameter`);
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Server Connection Error', message: 'Missing target URL parameter' }));
          return;
        }

        // Initialize status store
        const updateJob = (
          status: ProxyJobState['status'],
          strategy: string,
          message: string
        ) => {
          proxyJobStore.set(jobId, {
            jobId,
            url: targetUrl,
            status,
            strategy,
            message,
            timestamp: Date.now(),
          });
        };

        updateJob('connecting', 'Initiating', 'NCERT सर्वर से कनेक्ट हो रहा है...');

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('X-Proxy-Job-Id', jobId);

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        // Fast path for HEAD / Content-Length metadata requests
        if (isHeadRequest) {
          try {
            const headRes = await fetch(targetUrl, {
              method: 'HEAD',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                Referer: 'https://ncert.nic.in/',
              },
            });
            const len = headRes.headers.get('content-length') || '3000000';
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', len);
            res.statusCode = 200;
            res.end();
            return;
          } catch {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', '3000000');
            res.statusCode = 200;
            res.end();
            return;
          }
        }

        // STRATEGY 1: Direct undici fetch
        try {
          updateJob('fetching', 'Strategy 1: Direct Fetch', 'NCERT सर्वर से सीधे डाउनलोड किया जा रहा है...');
          console.log(`[PDF PROXY LOG ${timestamp}] [Strategy 1] Attempting direct fetch...`);

          const fetchRes = await fetch(targetUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              Accept: 'application/pdf,application/octet-stream,*/*',
              Referer: 'https://ncert.nic.in/',
            },
          });

          if (fetchRes.ok) {
            const arrayBuffer = await fetchRes.arrayBuffer();
            if (arrayBuffer.byteLength > 100) {
              updateJob('success', 'Strategy 1: Direct Fetch', 'PDF सफलतापूर्वक प्राप्त हुई');
              console.log(
                `[PDF PROXY SUCCESS ${timestamp}] [Strategy 1] Downloaded ${arrayBuffer.byteLength} bytes`
              );
              res.setHeader('Content-Type', fetchRes.headers.get('content-type') || 'application/pdf');
              res.setHeader('Content-Length', arrayBuffer.byteLength.toString());
              res.statusCode = 200;
              res.end(Buffer.from(arrayBuffer));
              return;
            }
          }
        } catch (err: any) {
          console.warn(`[PDF PROXY WARN ${timestamp}] Strategy 1 failed: ${err?.message || err}`);
        }

        // STRATEGY 2: Server-Side CORS Proxy Gateways
        const fallbackGateways = [
          `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
          `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
          `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
        ];

        for (let i = 0; i < fallbackGateways.length; i++) {
          const proxyGatewayUrl = fallbackGateways[i];
          try {
            updateJob(
              'fetching',
              `Strategy 2.${i + 1}: Proxy Gateway`,
              `सुरक्षित सर्वर गेटवे ${i + 1} से कनेक्ट हो रहा है...`
            );
            console.log(`[PDF PROXY LOG ${timestamp}] [Strategy 2.${i + 1}] Gateway: ${proxyGatewayUrl}`);

            const proxyRes = await fetch(proxyGatewayUrl);
            if (proxyRes.ok) {
              const arrayBuffer = await proxyRes.arrayBuffer();
              if (arrayBuffer.byteLength > 100) {
                updateJob('success', `Strategy 2.${i + 1}: Gateway`, 'PDF सफलतापूर्वक डाउनलोड हुई');
                console.log(
                  `[PDF PROXY SUCCESS ${timestamp}] Gateway retrieved ${arrayBuffer.byteLength} bytes`
                );
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Length', arrayBuffer.byteLength.toString());
                res.statusCode = 200;
                res.end(Buffer.from(arrayBuffer));
                return;
              }
            }
          } catch (err: any) {
            console.warn(`[PDF PROXY WARN ${timestamp}] Strategy 2.${i + 1} failed: ${err?.message || err}`);
          }
        }

        // STRATEGY 3: Custom Node.js HTTPS Agent
        try {
          updateJob('fetching', 'Strategy 3: HTTPS Agent', 'NCERT कस्टम एजेंट्स के माध्यम से प्रयास...');
          console.log(`[PDF PROXY LOG ${timestamp}] [Strategy 3] Node https fallback agent...`);

          const parsed = new URL(targetUrl);
          const reqClient = parsed.protocol === 'https:' ? https : http;
          const agent =
            parsed.protocol === 'https:'
              ? new https.Agent({ rejectUnauthorized: false, keepAlive: false })
              : undefined;

          const options = {
            hostname: parsed.hostname,
            port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
            path: parsed.pathname + parsed.search,
            method: 'GET',
            agent,
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              Accept: 'application/pdf,*/*',
              Referer: 'https://ncert.nic.in/',
              Host: parsed.hostname,
            },
          };

          const proxyReq = reqClient.request(options, (proxyRes) => {
            if (proxyRes.statusCode && proxyRes.statusCode >= 200 && proxyRes.statusCode < 300) {
              updateJob('success', 'Strategy 3: HTTPS Agent', 'PDF सफलतापूर्वक प्राप्त हुई');
              res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/pdf');
              res.statusCode = 200;
              proxyRes.pipe(res);
              return;
            }

            // If non-200 status
            const errorMsg = `Server Connection Error: NCERT server returned HTTP status ${proxyRes.statusCode}`;
            updateJob('error', 'Strategy 3: HTTPS Agent', errorMsg);
            if (!res.headersSent) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error: 'Server Connection Error',
                  message: `NCERT server is unreachable or returned status ${proxyRes.statusCode}`,
                })
              );
            }
          });

          proxyReq.on('error', (e) => {
            const errorMsg = `Server Connection Error: NCERT connection failed (${e.message})`;
            updateJob('error', 'Strategy 3: HTTPS Agent', errorMsg);
            if (!res.headersSent) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error: 'Server Connection Error',
                  message: `NCERT server is unreachable (${e.message})`,
                })
              );
            }
          });

          proxyReq.end();
          return;
        } catch (err: any) {
          const errorMsg = `Server Connection Error: ${err?.message || 'Unknown network error'}`;
          updateJob('error', 'Strategy 3: HTTPS Agent', errorMsg);
          if (!res.headersSent) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: 'Server Connection Error',
                message: errorMsg,
              })
            );
          }
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), pdfProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
