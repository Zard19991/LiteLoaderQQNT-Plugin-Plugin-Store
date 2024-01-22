/*
 * @Date: 2024-01-21 14:57:17
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-22 17:50:29
 */
import { setting_vue, plugins, fastestUrl } from "./renderer/setVue.js"
import { pluginsLoad } from "./renderer/api.js"
import { measureSpeed } from "./renderer/measureSpeed.js"

async function fetchData(plugin) {
    const data = await (await fetch(`${fastestUrl.value}https://raw.githubusercontent.com/${plugin.repo}/${plugin.branch}/manifest.json`)).json();
    if (data.repository.release.tag === "latest") {
      data.repository.release.tag = (await (await fetch(`${fastestUrl.value}https://api.github.com/repos/${plugin.repo}/releases/latest`)).json()).tag_name
    }
    data.icon = data.icon
                ? `${fastestUrl.value}https://raw.githubusercontent.com/${data.repository.repo}/${data.repository.branch}${data.icon.replace(".", "")}` 
                : `${fastestUrl.value}https://raw.githubusercontent.com/Night-stars-1/LiteLoaderQQNT-Plugin-Plugin-Store/master/icon.png`
    data.install = "安装";
    data.update = "更新";
    plugins.push(data)
}

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
    const urlsToTest = ['https://mirror.ghproxy.com/', 'https://ghproxy.net/', 'https://moeyy.cn/gh-proxy/'];
    const fastest = await measureSpeed(urlsToTest)
    fastestUrl.value = fastest.url;
    const pluginsData = fastest.data;
    Promise.all(pluginsData.map(fetchData)).then(() => {
        pluginsLoad();
    });
}

export {
    onSettingWindowCreated
}