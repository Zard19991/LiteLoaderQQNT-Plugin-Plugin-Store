/*
 * @Date: 2024-01-24 01:04:31
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-26 18:17:35
 */
import { pluginsLoad } from "./api.js"
import { measureSpeed } from "./reponse.js"
import { plugins, gPlugins, fastestUrl } from "./setVue.js"

async function getPluginData() {
    const urlsToTest = ['https://mirror.ghproxy.com/', 'https://ghproxy.net/', 'https://moeyy.cn/gh-proxy/', ''];
    const fastest = await measureSpeed(urlsToTest, 'https://raw.githubusercontent.com/LiteLoaderQQNT/Plugin-List/v4/plugins.json')
    fastestUrl.value = fastest.url;
    const pluginsData = fastest.data;
    Promise.all(pluginsData.map(fetchData)).then(() => {
        pluginsLoad();
    });
}


async function fetchData(plugin) {
    const data = await (await fetch(`${fastestUrl.value}https://raw.githubusercontent.com/${plugin.repo}/${plugin.branch}/manifest.json`)).json();
    if (data?.repository?.release?.tag === "latest") {
        const response = await fetch(`${fastestUrl.value}https://github.com/${plugin.repo}/releases/latest`);
        data.repository.release.tag = response.url.substring(response.url.lastIndexOf("/")+1);
    }
    data.icon = data.icon
                ? `${fastestUrl.value}https://raw.githubusercontent.com/${data.repository.repo}/${data.repository.branch}${data.icon.replace(".", "")}` 
                : `${fastestUrl.value}https://raw.githubusercontent.com/Night-stars-1/LiteLoaderQQNT-Plugin-Plugin-Store/master/icon.png`;
    data.install = data?.repository?.release? "安装":"无法下载";
    data.update = "更新";
    data.restart = false;
    gPlugins.push(data)
    plugins.value.push(data)
}
  
export {
    getPluginData
}