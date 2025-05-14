import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import createWinState from 'electron-win-state';
import path from 'path';
import { URL } from 'url';
import { promises as fsPromises } from 'fs'
const __dirname = path.resolve();
const WinState = createWinState.default;

const createWindow = () => {
  const winState = new WinState({
    defaultWidth: 1300,
    defaultHeight: 800,
  })
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1300,
    height: 800,
    ...WinState.winOptions,
    webPreferences: {
      webSecurity: false, // 禁用web安全策略
      allowRunningInsecureContent: true, // 允许运行不安全的内容
      // 使用预加载脚本
      preload: app.isPackaged 
        ? path.join(process.resourcesPath, 'preload/index.js') : path.join(__dirname, './preload/index.js'), 
      // 启用node集成
      nodeIntegration: false,
      // 启用上下文隔离 
      contextIsolation: true,
    },
  });


  // and load the index.html of the app.
  win.loadURL('http://localhost:5173/');
  // 自动打开开发者工具
  win.webContents.openDevTools();
  winState.manage(win);
};
app.whenReady().then(()=>{
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow() 
  })
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 监听来自渲染进程的打开窗口请求
ipcMain.handle('open-window', (url) => {
  const newWin = new BrowserWindow({
    width: 800,
    height: 600,
  });
  newWin.loadURL(url);
});

// 注册目录对话框 IPC 处理程序
ipcMain.handle('open-directory-dialog', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result.filePaths[0] || null
})

// 添加读取文件夹内容的处理程序
ipcMain.handle('read-folder', async (event, folderPath) => {
  console.log(64, folderPath)
  try {
    const files = await fsPromises.readdir(folderPath)
    const musicFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.mp3', '.wav', '.ogg', '.flac'].includes(ext)
    })
    return musicFiles.map(file => path.join(folderPath, file))
  } catch (error) {
    console.error('Error reading folder:', error)
    throw error
  }
})

ipcMain.handle('path-to-file-url', (event, filePath) => {
  // 1. 转换为绝对路径
  const absolutePath = path.resolve(filePath)
  
  // 2. 处理Windows路径
  let formattedPath = absolutePath
  if (process.platform === 'win32') {
    formattedPath = formattedPath.replace(/\\/g, '/') // 反斜杠转正斜杠
    if (!formattedPath.startsWith('/')) {
      formattedPath = `/${formattedPath}` // 添加前导斜杠
    }
  }

  // 3. 创建合法URL
  const fileUrl = new URL(`file://${encodeURI(formattedPath)}`).href
  return fileUrl
})