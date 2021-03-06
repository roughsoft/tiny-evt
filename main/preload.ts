import { contextBridge, ipcRenderer } from 'electron'
import { readFileSync } from 'fs'

// expose a require window global to Spectron so it can access the core Electron APIs.
if (process.env.NODE_ENV === 'development') {
  window.electronRequire = window.require
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

// whitelist channels
const validChannels = {
  send: ['async-ipc-from-renderer-to-main'],
  sendSync: ['open-preference-window'],
  receive: ['ipc_from_main']
}

contextBridge.exposeInMainWorld('ipcApi', {
  send: (channel: string, data: object) => {
    if (validChannels.send.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  sendSync: (channel: string, data: object) => {
    if (validChannels.sendSync.includes(channel)) {
      const result = ipcRenderer.sendSync(channel, data)
      console.log('[@preload.ipcApi.sendSync -> result]', result)
      return result
    }
  },
  receive: (channel: string, callback: (args: object) => void) => {
    if (validChannels.receive.includes(channel)) {
      console.log('[@preload.ipcApi.receive -> listens to channel]', channel)
      ipcRenderer.on(channel, (event, ...args) => {
        console.log('[@preload.ipcApi.receive -> on message]', event, args)
        callback(args)
      })
    }
  },
  // 上下文隔离 - preload 中可访问 node 提供的功能，封装之后暴露给 renderer process 使用，此处代码仅为示例
  readConfig: () => {
    const data = readFileSync('./config.json')
    return data
  }
})
