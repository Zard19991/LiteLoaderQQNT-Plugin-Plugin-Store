# LiteLoaderQQNT-Plugin-Plugin-Store | 插件商店

[格式参考](https://liteloaderqqnt.github.io/docs/introduction.html#manifest-json)

## 第三方商店侧载

`mainfest.yaml`文件下添加如下值
```json
"store": {
    "repo": "商店仓库",
    "branch": "商店分支",
    "save_folder": "插件数据目录下的文件夹相对路径，本目录是不填写"
}
```
并在目标仓库里创建`store.json`，格式如下
```json
[
    {
        "name": "名称",
        "save_name": "保存的名称",
        "description": "简介，可选",
        "download": "下载链接",
        "details": "详细，可选"
    }
]
```
> [!Tip]
>第三方插件可以通过调用api, 来打开商店
>```js
>pluginStore.createBrowserWindow(slug)
>```

### 第三方商店内容安装状态广播
插件商店在生成数据时会向主进程广播询问状态

主进程需要监听`LiteLoader.${slug}.onSnippetInstalled`并返回是否安装

注意 已安装->**true** 未安装->**false**, ${slug}为当前插件的slug
```
// 主进程
ipcMain.handle(
    "LiteLoader.${slug}.onSnippetInstalled",
    (event, file_name) => {
        console.log(file_name) // file_name为文件名
        return true
    }
);
```