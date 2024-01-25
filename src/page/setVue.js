/*
 * @Date: 2024-01-25 18:26:18
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-25 20:38:22
 */
import { getPluginData } from "./utils.js";
const { createApp, ref } = await import('../cdnjs.cloudflare.com_ajax_libs_vue_3.3.4_vue.esm-browser.prod.min.js');

const downloadFile = pluginStore.downloadFile
const uninstall = pluginStore.uninstall
const update = pluginStore.update
const restart = pluginStore.restart
const openWeb = pluginStore.openWeb
const createBrowserWindow = pluginStore.createBrowserWindow

const gPlugins = []
const plugins = ref([])
const fastestUrl = ref('');
const LiteLoader = window?.LiteLoader? window.LiteLoader : pluginStore.LiteLoader();

function init() {
    getPluginData(window.store_data);
    const app = createApp({
        methods: {
            openWeb,
            search() {
                this.plugins = gPlugins.filter(item =>
                  item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
                  || item.slug.toLowerCase().includes(this.searchTerm.toLowerCase())
                  || item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
                );
            },
            async install(index) {
                this.plugins[index].install = "安装中"
                const url = `${fastestUrl.value}${this.plugins[index].download}`;
                const save_folder = `${LiteLoader.plugins[window.store_data.slug].path.data}/${window.store_data.save_folder}`;
                this.plugins[index].install = await downloadFile(url, this.plugins[index].save_name, save_folder)
                this.plugins[index].restart = "重启"
            },
            restart(index) {
                this.plugins[index].restart = "重启中"
                restart()
            },
        },
        setup() {
            return {
                searchTerm: '',
                plugins,
                LiteLoader
            };
        },
    });
    app.mount('#pluginStore')
}

export {
    init,
    gPlugins,
    plugins,
    fastestUrl
}