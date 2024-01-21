/*
 * @Date: 2024-01-21 14:57:08
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-22 01:18:00
 */
// 运行在 Electron 主进程 下的插件入口
const { ipcMain, app, shell, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const StreamZip = require("node-stream-zip");

// 简易的GET请求函数
function request(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith("https") ? https : http;
        const req = protocol.get(url);
        req.on("error", (error) => reject(error));
        req.on("response", (res) => {
            // 发生跳转就继续请求
            if (res.statusCode >= 300 && res.statusCode <= 399) {
                return resolve(request(res.headers.location));
            }
            const chunks = [];
            res.on("error", (error) => reject(error));
            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => {
                var data = Buffer.concat(chunks);
                resolve({
                    data: data,
                    str: data.toString("utf-8"),
                    url: res.url
                });
            });
        });
    });
}

async function install(url, slug) {
    const { plugins } = LiteLoader.path;
    const plugin_path = `${plugins}/${slug}`;
    try {
        const pluginDataPath = LiteLoader.plugins.pluginStore.path.data;
        const body = (await request(url)).data;

        const cache_file_path = path.join(pluginDataPath, `${slug}.zip`);
        fs.mkdirSync(pluginDataPath, { recursive: true });
        fs.writeFileSync(cache_file_path, body);

        // 解压并安装插件
        fs.mkdirSync(plugin_path, { recursive: true });
        const zip = new StreamZip.async({ file: cache_file_path });
        const entries = await zip.entries();
        const isFolder = !entries.hasOwnProperty("manifest.json") // 判断是否需要保留一级目录 true为不保留
        for (const entry of Object.values(entries)) {
            if (!entry.name.includes(".github")) {
                const pathname = `${plugin_path}/${isFolder? entry.name.split('/').slice(1).join('/') : entry.name}`;
                // 创建目录
                if (entry.isDirectory) {
                    fs.mkdirSync(pathname, { recursive: true });
                    continue;
                }
                // 创建文件 有时不会先创建目录
                try {
                    if (entry.isFile) {
                        await zip.extract(entry.name, pathname);
                        continue;
                    }
                } catch (error) {
                    fs.mkdirSync(pathname.slice(0, pathname.lastIndexOf('/')), { recursive: true });
                    await zip.extract(entry.name, pathname);
                    continue
                }

            }
        }
        await zip.close();
        return "安装成功";
    } catch (error) {
        console.log(error)
        // 安装失败删除文件
        //fs.rmSync(plugin_path, { recursive: true, force: true });
        if (error.message.includes('Bad archive')) {
            return "安装包异常，可能是作者未正确配置";
        }
        return "安装失败";
    }
}

async function uninstall(slug, update_mode = false) {
    const paths = LiteLoader.plugins[slug].path;

    // 没有返回false
    if (!paths) {
        return false;
    }

    // 更新模式只删除插件本体
    if (update_mode) {
        fs.rmSync(paths.plugin, { recursive: true, force: true });
        return true;
    }

    // 删除插件的目录
    for (const [name, path] of Object.entries(paths)) {
        fs.rmSync(path, { recursive: true, force: true });
    }

    // 成功返回true
    return true;
}

async function update(url, slug) {
    // 先卸载
    if (!(await uninstall(slug, true))) {
        return "更新失败";
    }
    // 后安装
    if (!(await install(url, slug))) {
        return "更新失败";
    }
    return "更新成功";
}

async function restart() {
    app.relaunch();
    app.exit(0);
}

function openWeb(url) {
    shell.openExternal(url);
}

// 加载插件时触发
function onLoad(plugin) {
    // 安装
    ipcMain.handle(
        "LiteLoader.pluginStore.install",
        (event, ...message) => install(...message)
    );
    // 卸载
    ipcMain.handle(
        "LiteLoader.pluginStore.uninstall",
        (event, ...message) => uninstall(...message)
    );
    // 更新
    ipcMain.handle(
        "LiteLoader.pluginStore.update",
        (event, ...message) => update(...message)
    );
    // 重开
    ipcMain.handle(
        "LiteLoader.pluginStore.restart",
        (event, ...message) => restart()
    );
    // 外部打开网址
    ipcMain.on("LiteLoader.pluginStore.openWeb", (event, ...message) =>
        openWeb(...message)
    );
    ipcMain.on("LiteLoader.pluginStore.createWin", (event, message) => {
        setTimeout(() => {
            BrowserWindow.getAllWindows().forEach(window => {
                if (window.webContents.getURL().includes("#/setting/settings/common")) {
                    window.webContents.send('message-main', message);
                }
            });
        }, 1000);
    });
}


onLoad()