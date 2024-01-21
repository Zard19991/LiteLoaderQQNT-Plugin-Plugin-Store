// Electron 主进程 与 渲染进程 交互的桥梁
const { contextBridge, ipcRenderer } = require("electron");

// 在window对象下导出只读对象
contextBridge.exposeInMainWorld("pluginStore", {
    // 安装
    install: (url, slug) =>
        ipcRenderer.invoke("LiteLoader.pluginStore.install", url, slug),
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
        ipcRenderer.send("LiteLoader.pluginStore.openWeb", url)
});