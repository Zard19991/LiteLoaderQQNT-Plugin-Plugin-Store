/*
 * @Date: 2024-01-21 23:23:35
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-24 18:13:54
 */
const ipcRenderer = pluginStore.ipcRenderer_LL;
const ipcRenderer_on = pluginStore.ipcRenderer_LL_on;
const createWin = pluginStore.createWin;

let gslug = "";

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
const apiInstance = new Api();
Object.defineProperty(window, "StoreAPI", {
    value: apiInstance,
    writable: false,
});

function pluginsLoad() {
    if (gslug) {
        const targetElement = document.getElementById(gslug);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth', // 使用平滑滚动
                block: 'start',     // 将目标元素的开始位置对齐到其包含块的开始位置 center->中间
            });
        }
    }
    gslug = "";
}

ipcRenderer_on('message-main', (event, slug) => {
    gslug = slug;
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const { target } of mutationsList) {
            if (target.classList?.contains("store")) {
                target.click();
                observer.disconnect();
            }
        }
      });
    observer.observe(document.querySelector(".nav-bar"), { subtree: true, attributes: true, attributeFilter: ['class'] });
});

export {
    pluginsLoad
}
