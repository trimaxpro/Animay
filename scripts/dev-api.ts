import http from 'http';
import fs from 'fs';
import path from 'path';
import handler from '../api/index';

// Simple .env parser to avoid external dependencies
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const index = trimmed.indexOf('=');
        if (index !== -1) {
          const key = trimmed.substring(0, index).trim();
          const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.warn('Could not parse .env file:', e);
}

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  // Add Vercel helper methods to the response object
  (res as any).status = function (code: number) {
    this.statusCode = code;
    return this;
  };

  (res as any).json = function (data: any) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
    return this;
  };

  try {
    console.log(`[API Request] ${req.method} ${req.url}`);
    await handler(req, res);
  } catch (err) {
    console.error('API Error:', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: true, message: err instanceof Error ? err.message : String(err) }));
  }
});

server.listen(PORT, () => {
  console.log(`Local API Dev Server listening on http://localhost:${PORT}`);
  console.log(`Proxying requests to Vercel Serverless Function (api/index.ts)`);
});
