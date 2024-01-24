/*
 * @Date: 2024-01-21 14:57:17
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-24 01:00:33
 */
import { setting_vue } from "./renderer/setVue.js"
import { getPluginData } from "./renderer/utils.js";


async function onSettingWindowCreated(view){
    const plugin_path = LiteLoader.plugins.pluginStore.path.plugin;
    const html_file_path = `local:///${plugin_path}/src/view/view.html`;
    // 插入设置页
    const htmlText = await (await fetch(html_file_path)).text()
    view.insertAdjacentHTML('afterbegin', htmlText)
    // CSS
    const css_file_path = `local:///${plugin_path}/src/view/view.css`;
    const link_element = document.createElement("link");
    link_element.rel = "stylesheet";
    link_element.href = css_file_path;
    document.head.appendChild(link_element);
    
    document.querySelectorAll(".nav-item.liteloader").forEach(node => {
        if (node.textContent === "插件商店") {
            node.classList.add("store")
            setting_vue(node)
        }
    })
    getPluginData()
}

export {
    onSettingWindowCreated
}