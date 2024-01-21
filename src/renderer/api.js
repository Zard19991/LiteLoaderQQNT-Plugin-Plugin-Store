const ipcRenderer = pluginStore.ipcRenderer_LL;
const ipcRenderer_on = pluginStore.ipcRenderer_LL_on;
const createWin = pluginStore.createWin;

function ntCall(eventName, cmdName, args, isRegister = false) {
    const uuid = crypto.randomUUID();
    ipcRenderer.send(
        `IPC_UP_2`,
        {
            type: "request",
            callbackId: uuid,
            eventName: `${eventName}-2${isRegister ? "-register" : ""}`,
        },
        [cmdName, ...args]
    );
}

class Api {
    openStore(slug) {
        ntCall("ns-WindowApi", "openExternalWindow", [
            "SettingWindow"
        ]);
        createWin(slug);
    }
}
export const apiInstance = new Api();
Object.defineProperty(window, "StoreAPI", {
    value: apiInstance,
    writable: false,
});

ipcRenderer_on('message-main', (event, arg) => {
    console.log('渲染进程收到消息:', arg);
    document.querySelector(".liteloader.store").click();
    const targetElement = document.getElementById(arg);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth', // 使用平滑滚动
        block: 'start',     // 将目标元素的开始位置对齐到其包含块的开始位置 center->中间
      });
    }
});
