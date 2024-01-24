/*
 * @Date: 2024-01-24 00:36:32
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-24 16:00:12
 * 自定义页面兼容程序
 */
import { init } from "../renderer/setVue.js"
import { getPluginData } from "../renderer/utils.js";

const LiteLoader = pluginStore.LiteLoader()

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
getPluginData()
console.log("测试")

const plugin_path = LiteLoader.plugins.pluginStore.path.plugin;
// CSS
const css_file_path = `local:///${plugin_path}/src/view/view.css`;
const link_element = document.createElement("link");
link_element.rel = "stylesheet";
link_element.href = css_file_path;
//document.head.appendChild(link_element);

function injectChiiDevtools(port) {
  const script = document.createElement("script");
  script.defer = "defer";
  script.src = `http://localhost:${port}/target.js`;
  document.head.append(script);
}
injectChiiDevtools("6754")
