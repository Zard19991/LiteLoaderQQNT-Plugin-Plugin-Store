/*
 * @Date: 2024-01-21 14:56:46
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-25 20:17:49
 */
// Electron 主进程 与 渲染进程 交互的桥梁
const { contextBridge, ipcRenderer } = require("electron");

// 在window对象下导出只读对象
contextBridge.exposeInMainWorld("pluginStore", {
    ipcRenderer_LL: ipcRenderer,
    ipcRenderer_LL_on: (channel, callback) => {
        ipcRenderer.on(channel, callback)
    },
    // 安装
    install: (url, slug) =>
        ipcRenderer.invoke("LiteLoader.pluginStore.install", url, slug),
    // 下载文件
    downloadFile: (url, file_name, save_folder) =>
        ipcRenderer.invoke("LiteLoader.pluginStore.downloadFile", url, file_name, save_folder),
    // 卸载
    uninstall: (slug) =>
        ipcRenderer.invoke(
            "LiteLoader.pluginStore.uninstall",
            slug
        ),
    // 更新
    update: (url, slug) =>
        ipcRenderer.invoke("LiteLoader.pluginStore.update", url, slug),
    // 重开
    restart: () => ipcRenderer.invoke("LiteLoader.pluginStore.restart"),
    // 外部打开网址
    openWeb: (url) =>
        ipcRenderer.send("LiteLoader.pluginStore.openWeb", url),
    createWin: (message) =>
        ipcRenderer.send("LiteLoader.pluginStore.createWin", message),
    createBrowserWindow: (slug) => {
        const LiteLoader = ipcRenderer.sendSync("LiteLoader.LiteLoader.LiteLoader")
        const store = LiteLoader.plugins[slug].manifest.store;
        store.slug = slug;
        ipcRenderer.send("LiteLoader.pluginStore.createBrowserWindow", JSON.stringify(store))
    },
    log: (level, ...serializedArgs) =>
            ipcRenderer.send("LiteLoader.pluginStore.log", level, ...serializedArgs),
    LiteLoader: () => {
        return {
            ...ipcRenderer.sendSync("LiteLoader.LiteLoader.LiteLoader")
        }
    }
});