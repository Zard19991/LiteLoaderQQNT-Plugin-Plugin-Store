/*
 * @Date: 2024-01-24 00:36:32
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-25 20:05:53
 * 自定义页面兼容程序
 */
import { init } from "./setVue.js"
import { getPluginData } from "./utils.js";

const ipcRenderer_on = pluginStore.ipcRenderer_LL_on;

ipcRenderer_on('store-data', (event, data) => {
  window.store_data = JSON.parse(data);
  getPluginData(window.store_data);
});

function customInspect(obj, depth = 0) {
    if (depth > 3) {
      return '...'; // 控制递归深度
    }
    
    if (typeof obj !== 'object' || obj === null) {
      return String(obj);
    }
    
    if (Array.isArray(obj)) {
      const elements = obj.map((item) => customInspect(item, depth + 1)).join(', ');
      return `[${elements}]`;
    }
    
    const entries = Object.entries(obj)
      .map(([key, value]) => `${key}: ${customInspect(value, depth + 1)}`)
      .join(', ');
    
    return `{${entries}}`;
}

function patchLogger() {
    const log = async (level, ...args) => {
        const serializedArgs = [];
        for (const arg of args) {
            serializedArgs.push(typeof arg == "string" ? arg: await customInspect(arg)); // arg?.toString()
        }
        pluginStore.log(level, ...serializedArgs)
    };
    (
        [
            ["debug", 0],
            ["log", 1],
            ["info", 2],
            ["warn", 3],
            ["error", 4],
        ]
    ).forEach(([method, level]) => {
        const originalConsoleMethod = console[method];
        console[method] = (...args) => {
            log(level, ...args)
            originalConsoleMethod.apply(console, args);
        };
    });
}
patchLogger(); // 重写渲染进程log
init()

function injectChiiDevtools(port) {
  const script = document.createElement("script");
  script.defer = "defer";
  script.src = `http://localhost:${port}/target.js`;
  document.head.append(script);
}
injectChiiDevtools("6754")
