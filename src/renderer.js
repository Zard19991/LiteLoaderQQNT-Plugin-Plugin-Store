import { setting_vue, plugins } from "./renderer/setVue.js"

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
    
    const response = await fetch("https://raw.githubusercontent.com/LiteLoaderQQNT/Plugin-List/v4/plugins.json");
    const pluginsData = await response.json();
    pluginsData.forEach(async plugin => {
        const data = await (await fetch(`https://raw.githubusercontent.com/${plugin.repo}/${plugin.branch}/manifest.json`)).json();
        data.icon = data.icon? `https://raw.githubusercontent.com/${data.repository.repo}/${data.repository.branch}${data.icon.replace(".", "")}` : "https://raw.githubusercontent.com/Night-stars-1/LiteLoaderQQNT-Plugin-Plugin-Store/icon.png"
        plugins.push(data)
    })
    document.querySelectorAll(".nav-item.liteloader").forEach(node => {
        if (node.textContent === "插件商店") {
            setting_vue(node)
        }
    })
}

export {
    onSettingWindowCreated
}