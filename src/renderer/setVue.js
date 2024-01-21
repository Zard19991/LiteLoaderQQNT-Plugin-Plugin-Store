/*
 * @Date: 2024-01-19 16:55:53
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-21 19:16:50
 */
// 导入工具函数
const { createApp, reactive } = await import('../cdnjs.cloudflare.com_ajax_libs_vue_3.3.4_vue.esm-browser.prod.min.js');
const install = pluginStore.install
const uninstall = pluginStore.uninstall
const update = pluginStore.update
const restart = pluginStore.restart
const openWeb = pluginStore.openWeb

const plugins = reactive([])

async function setting_vue(node) {
    const htmlicon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M841-518v318q0 33-23.5 56.5T761-120H201q-33 0-56.5-23.5T121-200v-318q-23-21-35.5-54t-.5-72l42-136q8-26 28.5-43t47.5-17h556q27 0 47 16.5t29 43.5l42 136q12 39-.5 71T841-518Zm-272-42q27 0 41-18.5t11-41.5l-22-140h-78v148q0 21 14 36.5t34 15.5Zm-180 0q23 0 37.5-15.5T441-612v-148h-78l-22 140q-4 24 10.5 42t37.5 18Zm-178 0q18 0 31.5-13t16.5-33l22-154h-78l-40 134q-6 20 6.5 43t41.5 23Zm540 0q29 0 42-23t6-43l-42-134h-76l22 154q3 20 16.5 33t31.5 13ZM201-200h560v-282q-5 2-6.5 2H751q-27 0-47.5-9T663-518q-18 18-41 28t-49 10q-27 0-50.5-10T481-518q-17 18-39.5 28T393-480q-29 0-52.5-10T299-518q-21 21-41.5 29.5T211-480h-4.5q-2.5 0-5.5-2v282Zm560 0H201h560Z"/></svg>`
    node.querySelector(".q-icon.icon").insertAdjacentHTML('afterbegin', htmlicon)
    node.addEventListener("click", async () => {
        if (!document.querySelector("#pluginStore")?.__vue_app__) {
            const app = createApp({
              methods: {
                details(repo) {
                  const url = `https://github.com/${repo}`;
                  openWeb(url);
                },
                async install(repository, slug, index) {
                    plugins[index].install = "安装中"
                    plugins[index].installStatus = true
                    const url = repository.file
                        ? `https://github.com/${repository.repo}/releases/download/${repository.release.tag}/${repository.release.file}`
                        : `https://github.com/Night-stars-1/LiteLoaderQQNT-Plugin-QQPromote/archive/refs/tags/${repository.release.tag}.zip`;
                    plugins[index].install = (await install(url, slug))? "安装成功" : "安装失败"
                },
                async update(repository, slug, index) {
                  plugins[index].install = "更新中"
                  plugins[index].installStatus = true
                  const url = repository.file
                      ? `https://github.com/${repository.repo}/releases/download/${repository.release.tag}/${repository.release.file}`
                      : `https://github.com/Night-stars-1/LiteLoaderQQNT-Plugin-QQPromote/archive/refs/tags/${repository.release.tag}.zip`;
                  plugins[index].install = (await update(url, slug))? "更新成功" : "更新失败"
                },
                toAuthor(link) {
                  openWeb(link);
                },
              },
              setup() {
                return {
                  plugins,
                  LiteLoader
                };
              },
            });
            app.mount('#pluginStore')
        }
    })
}

export {
    plugins,
    setting_vue
}