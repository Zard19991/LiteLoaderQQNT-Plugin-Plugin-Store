/*
 * @Date: 2024-01-24 01:04:31
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-26 00:46:35
 */
import { measureSpeed } from "../renderer/reponse.js"
import { plugins, gPlugins, fastestUrl } from "./setVue.js"

const onSnippetInstalled = pluginStore.onSnippetInstalled;

async function getPluginData(store) {
    const urlsToTest = ['https://mirror.ghproxy.com/', 'https://ghproxy.net/', 'https://moeyy.cn/gh-proxy/', ''];
    const fastest = await measureSpeed(urlsToTest, `https://raw.githubusercontent.com/${store.repo}/${store.branch}/store.json`)
    fastestUrl.value = fastest.url;
    const pluginsData = fastest.data;
    pluginsData.map(fetchData)
}


async function fetchData(data) {
    try {
        data.install = await onSnippetInstalled(window.store_data.slug, data.save_name)? "已安装":"安装";
    } catch (error) {
        data.install = "安装";
    }
    data.update = "更新";
    data.restart = false;
    gPlugins.push(data);
    plugins.value.push(data);
}
  
export {
    getPluginData
}