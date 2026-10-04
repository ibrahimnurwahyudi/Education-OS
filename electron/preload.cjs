const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('educationOSDesktop', {
  version: '1.0.0',
  offline: true,
  platform: 'windows',
});
