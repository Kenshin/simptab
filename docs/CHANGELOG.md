#### 1.5.3

> 2018-11-25

- :sparkles: 新增 [禅模式](http://ksria.com/simptab/docs/#/禅模式)；

  > 包含了：多种主题 · 模块化 · 自定义样式 等，适合喜欢纯色背景且无干扰界面的用户。

  ![禅模式](https://i.loli.net/2018/11/23/5bf79e09c11f6.jpg)

- :sparkles: 新增 [选项页](http://ksria.com/simptab/docs/#/选项页)；

  ![选项页](https://i.loli.net/2018/11/23/5bf7b165cfe22.jpg)

  > 包括以下几个重要功能：

  - [自定义Unsplash](http://ksria.com/simptab/docs/#/%E5%A4%9A%E7%A7%8D%E8%83%8C%E6%99%AF%E6%BA%90?id=%e8%87%aa%e5%ae%9a%e4%b9%89unsplash) 以及 精选集背景的顺序显示；
  - 快捷搜索栏接入多种搜索引擎并可定制化； [#47](https://github.com/Kenshin/simptab/issues/47)

  - Topsites 在 `简单模式 · 高级模式` 的基础上增加了自定义的功能；

  - 全局化的自定义样式； [#43](https://github.com/Kenshin/simptab/issues/43)

- :sparkles: 新增 自定义站点的 快捷键支持，触发键为 z ~ `<1-9>` 号，详细请看 [自定义站点](http://ksria.com/simptab/docs/#/%E9%80%89%E9%A1%B9%E9%A1%B5?id=%e8%87%aa%e5%ae%9a%e4%b9%89%e7%ab%99%e7%82%b9)  [#19](https://github.com/Kenshin/simptab/issues/19)

- 💄  优化了  `Bookmark` `History` `Apps` 合并为一个横向 icon bar [#46](https://github.com/Kenshin/simptab/issues/46)

  ![Xnip2018-11-24_16-42-13.jpg](https://i.loli.net/2018/11/24/5bf90f0077050.jpg)

- :fire: 去掉了 已失效的背景源 `flickr.com`；

- :bug: 修复了 [#40](https://github.com/Kenshin/simptab/issues/40) [#41](https://github.com/Kenshin/simptab/issues/41) [#46](https://github.com/Kenshin/simptab/issues/46) 错误；

***

#### 1.5.2

> 2018-10-14

- :sparkles: 新增 `书签栏`；
  ![2018-10-12_141443.png](https://i.loli.net/2018/10/12/5bc03d1ce05cc.png)
  1. 需要申请权限，侧栏 → 选中 `开启书签栏`；

  2. 搜索（支持：`域名` 和 `标题`）
  > 点击后，打开类似 Quick bar 的搜索。

  3. 近期使用的 URL;

- :sparkles: 新增 `背景管理器` （点击控制栏 → 设定 → 背景管理器）
  > 详细说明请看 (功能一览)[http://ksria.com/simptab/docs/#/功能一览?id=主要功能之一-1]

  ![2018-10-11_13-56-35.png](https://i.loli.net/2018/10/12/5bc03f7e85fd7.png)
  1. 开启  `背景管理器` ；

  2. 1.5.2 包含：`收藏` 与 `订阅` 两个 Tab ；

  3. `收藏` 与 `订阅` 的区别：前者可以删除；

  4. 依次为：照片的作者 · 照片的出处 · 设置为当前背景 · 下载；

- :sparkles: 新增 `关于` 页面；
  ![2018-10-12_144121.png](https://i.loli.net/2018/10/12/5bc0487f163d2.png)

- :sparkles: 新增 `欢迎` 页面；
  ![2018-10-12_145647.png](https://i.loli.net/2018/10/12/5bc048bf612f8.png)

- :sparkles: 新增 `只显示当前背景` 的选项；
  > 与 `Pin` 的区别是，选中此项后，当前背景永不再改变；后者只是固定一段时间；

  ![2018-10-12_150254.png](https://i.loli.net/2018/10/12/5bc047edc3abf.png)

- :sparkles: 新增 `刷新（下一张）` 的选项；
  > 点击后，会在当前 New Tab 基础上更新下一张背景；

  ![2018-10-12_151000.png](https://i.loli.net/2018/10/12/5bc049456454d.png)

- :lipstick: 优化了 `全局快捷键`
  > 通过全局快捷键 <kbd>?</kbd> 呼出

  ![快捷键](https://i.loli.net/2018/10/11/5bbefe9e22160.png)

- :lipstick: 优化了 `必应每日更新` `必应随机背景` `收藏夹背景源` 的优先级，现在可以关闭它们；

  ![2018-10-12_151532.png](https://i.loli.net/2018/10/12/5bc04a94bcb15.png)

- :hammer: 重构了页面布局，使其更符合 HTML5 与 Material Design 风格；

- :lipstick: 优化了侧栏的布局，去掉了无用的分享功能；

- :hammer: 重构了全部的字体样式，去掉了之前 `繁体` `English` 的特殊字体方案；

- :hammer: 重构了 Tooltip，新方案使用了第三方库 [Balloon.css](https://kazzkiq.github.io/balloon.css/)

- :hammer: 统一了 `bookmarks` 与 `setting` 的动效；

- :hammer: 重构了 `Topsites - 高级模式(九宫格)` 的 UI;

- :memo: 截至到目前全部的功能
  ![SimpTab 1.5.2](https://i.loli.net/2018/10/11/5bbf2d08da9c1.png)

***

#### 1.5.1

> 2018-08-12

- :sparkles: 增加了 全新的 **【SimpTab 精选集】**；  
  > 类似 iOS 某些壁纸 App 的方式，通过手动采集的方式更新，每周一期。  

  ![Imgur](https://i.imgur.com/pblZLv0.png)

- :sparkles: 增加了 [Waves](http://fian.my.id/Waves/) 动效；

- :sparkles: 增加了 全新的背景布局：`相框布局`；
  ![Imgur](https://i.imgur.com/7HuDEdpl.png)

- :lipstick: 优化了 界面，使其更符合 Google Metarial Design 风格； _包括：Topsites / 侧栏 / Tooltip / Clock 等_

- :lipstick: 更新了 若干依赖；_包括： jQuery / Notify_

- :bug: 修复了 `bing.com 每日图片` 无法获取的错误； [issues 31](https://github.com/kenshin/simptab/issues/31) · [issues 34](https://github.com/kenshin/simptab/issues/34)

- :bug: 修复了 `随机 bing.com` 的地址源失效问题；_新的地址来源于 [https://bingwallpaper.com/](https://bingwallpaper.com/)_

- :bug: 修复了 `收藏` 后的壁纸加载慢的问题；

- :fire: 去掉了 侧栏分享的功能；

- :fire: 去掉了 已失效的背景源 `500px.com` `nasa.gov`；

***

#### 1.5.0

> 2016-02-11

- :sparkles: 增加了 `Pin` 功能；

  > 可以固定一段时间，包括： 0.5, 1, 2, 4, 8 小时

- :sparkles: 增加了 `dislike` 功能；

  > 加入后不再显示当前背景；

- :sparkles: 增加了 背景源的 CDN 功能；

- :bug: 修复了 `checkbox/radio` 偶尔无法点击的错误； [issues 16](https://github.com/kenshin/simptab/issues/16)

***

#### 1.4.3

> 2016-01-20

- :sparkles: 增加了 版本介绍；

- :sparkles: 增加了 `动态权限设定` 功能；

- :sparkles: 增加了 `背景源的显示位置`，包括： `居中`和 `左上角` 对其；

- :pencil2: 优化了设定栏的 icon；

***

#### 1.4.2

> 2015-12-25

- :sparkles: 增加了 新的背景源： [NASA Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html)

- :sparkles: 增加了 新的背景源： `SimpTab Images`.

***

#### 1.4.1

> 2015-12-23

- :sparkles: 常用网址增加了全新的： `高级布局` 方式；

- :bug: 调整了 `常用网址（简单布局）` 鼠标 hover 时的显示速度.

- :bug: 修复 `Notifiy` z-index 错误； [issues 8](https://github.com/kenshin/simptab/issues/8)

***

#### 1.4.0

> 2015-12-10

- :sparkles: 增加了 多语言，包括： [Chinese Simplified](https://github.com/kenshin/simptab/blob/master/README.md) | [Traditional Chinese](https://github.com/kenshin/simptab/blob/master/README.tw.md) | [English](https://github.com/kenshin/simptab/blob/master/README.en.md)

- :sparkles: 增加了 新的背景源： `bing.com`, `wallhaven.cc`, `unsplash.com`, `flickr.com`, `googleartproject.com`, `500px.com`, `desktoppr.co`, `visualhunt.com`, `nasa apod`, `simptab images`.

- :sparkles: 增加了 `上传背景源` 功能；

- :sparkles: 增加了 `fovorite` 功能；

- :sparkles: 增加了 `top sites` 功能；

- :sparkles: 增加了 加载新的背景源时的进度显示；

- :sparkles: 增加了 `Favorite/Upload` 背景源的提示；

- :sparkles: 增加了 `omnibox` 快捷键；

- :hammer: 重构了代码；

- :bug: 修复了 `1.0.3` 版版的错误，包括： [issues 5](https://github.com/kenshin/simptab/issues/5), [issues 7](https://github.com/kenshin/simptab/issues/7)

***

#### 1.0.3

> 2014-08-29

- :sparkles: 增加了 `clock's font-family` to `roboto.ttf`.

- :bug: 修复了 下载背景时重复命名的错误；

- :bug: 修复了 第一次安装下载背景的错误；

- :bug: 修复了 默认背景下载时命名的错误；

- :bug: 修复了 非 `zh-cn` 环境下 `info 链接` 指向的错误；

***

#### 1.0.2

> 2014-08-28

- :sparkles: 增加了 `main.html's title` 的多语言；

- :sparkles: 增加了 `Bookmark/Apps/Histroy/Info` 在本页打开的功能；

- :sparkles: 增加了 `controlbar` 的快捷键方案；

***

#### 1.0.1

> 2014-08-22

- :sparkles: 增加了 `footer 栏` 投票的链接；

- :pencil2: 优化了 `分享 icon` 的多语言；

- :bug: 修复了 main.html's title 为 `SimpTab - Minimalistic New Tab Page by Chrome Extensions`;

- :bug: 修复了 一些文案上的错误；

***

#### 1.0.0

> 2014-08-20

- :sparkles: 增加了 `多语言` 环境；

- :sparkles: 增加了 `每日/随机` （ 从 `bing.com` ）更换背景；

- :sparkles: 增加了 `下载背景` 功能；

- :sparkles: 增加了 `info` 功能；