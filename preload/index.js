// 注入一个方法使页面可以调用electron打开窗口方法
const {
  contextBridge,
  ipcRenderer
} = require('electron');

// 暴露一个方法用于打开新窗口
contextBridge.exposeInMainWorld('openWindow', (name) => {
  ipcRenderer.send('open-window', name);
});

contextBridge.exposeInMainWorld('electronAPI', {
  openDirectoryDialog: () => ipcRenderer.invoke('open-directory-dialog'),
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close'),
  readFolder: (folderPath) => ipcRenderer.invoke('read-folder', folderPath),
  pathToFileURL: (path) => ipcRenderer.invoke('path-to-file-url', path)
})
