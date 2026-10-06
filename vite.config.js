import { defineConfig } from 'vite';
import os from 'node:os';

function shareAddressMiddleware(request, response, next) {
  if (request.url?.split('?')[0] !== '/__ecoquiz/share-address') {
    next();
    return;
  }

  const addresses = Object.values(os.networkInterfaces())
    .flat()
    .filter((network) => network && network.family === 'IPv4' && !network.internal)
    .map((network) => network.address);
  const privateAddress = addresses.find((address) =>
    /^10\./.test(address) || /^192\.168\./.test(address) || /^172\.(1[6-9]|2\d|3[01])\./.test(address)
  );

  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify({ address: privateAddress || addresses[0] || null }));
}

const shareAddressPlugin = {
  name: 'ecoquiz-share-address',
  configureServer(server) {
    server.middlewares.use(shareAddressMiddleware);
  },
  configurePreviewServer(server) {
    server.middlewares.use(shareAddressMiddleware);
  },
};

export default defineConfig({
  plugins: [shareAddressPlugin],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});
