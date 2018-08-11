<p align="center"><img src="http://simptab.qiniudn.com/logo@192.png" /></p>
<h1 align="center">简 Tab - 极简的 Chrome 新标签页扩展</h1>
<p align="center">望你每次打开都有好心情；去除多余功能，只关注标签页呈现效果。</p>
<p align="center">
   <a href="https://github.com/kenshin/simptab/releases"><img src="https://img.shields.io/badge/lastest_version-1.5.1-blue.svg"></a>
   <a target="_blank" href="http://ksria.com/simptab"><img src="https://img.shields.io/badge/website-_simptab.ksria.com-1DBA90.svg"></a>
   <a target="_blank" href="https://chrome.google.com/webstore/detail/simptab-new-tab/kbgmbmkhepchmmcnbdbclpkpegbgikjc"><img src="https://img.shields.io/badge/download-_chrome_webstore-brightgreen.svg"></a>
   <a href="http://ksria.com/simptab/crx/1.5.1/simptab.crx"><img src="https://img.shields.io/badge/download-_crx-brightgreen.svg"></a>
</p>

***

下载
---
[Chrome 应用商店](https://chrome.google.com/webstore/detail/simptab-new-tab/kbgmbmkhepchmmcnbdbclpkpegbgikjc) 或者 [离线下载](http://ksria.com/simptab/crx/1.5.1/simptab.crx)

详细介绍
---
https://github.com/Kenshin/simptab

版本说明
---

#### 1.5.1

> 2018-08-12

* :sparkles: 增加了 全新的 **【SimpTab 精选集】**；  
  > 类似 iOS 某些壁纸 App 的方式，通过手动采集的方式更新，每周一期。
* :sparkles: 增加了 [Waves](http://fian.my.id/Waves/) 动效；

* :lipstick: 优化了 界面，使其更符合 Google Metarial Design 风格；（包括：Topsites / 侧栏 / Tooltip / Clock 等）
* :arrow_up: 更新了 若干依赖；（ jQuery / Notify ）

* :bug: 修复了 `bing.com 每日图片` 无法获取的错误； [issues 31](https://github.com/kenshin/simptab/issues/31) · [issues 34](https://github.com/kenshin/simptab/issues/34)
* :bug: 修复了 `随机 bing.com` 的地址源失效问题，新的地址来源于 [https://bingwallpaper.com/](https://bingwallpaper.com/)；

* :fire: 去掉了 侧栏分享的功能；
* :fire: 去掉了 `500px.com` `nasa.gov` （已失效，所以去除。）

***

- 2016-02-11, Version 1.5.0
  * Add pin feature.
  * Add dislike feature.
  * Add background remote cdns feature.
  * Fix checkbox/radio item click invalid bug. [issues 16](https://github.com/kenshin/simptab/issues/16)

- 2016-01-20, Version 1.4.3
  * More detailed version for version feature.
  * Dynamic set permissions.
  * Modify settin bar icon.
  * Add background position item, intelligent adjusting background position.

- 2015-12-25, Version 1.4.2
  * Add new background: [NASA Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html)
  * Add special day(SimpTab Images) to Setting bar.

- 2015-12-23, Version 1.4.1
  * Add 'senior' and 'normal' topsites.( old topsites only 'simple' mode.)
  * Fix 'simple' mode topsites hover display speed.
  * Fix notifiaction show z-index bug. [issues 8](https://github.com/kenshin/simptab/issues/8)

- 2015-12-10, Version 1.4.0
  * Feature: [Chinese Simplified](https://github.com/kenshin/simptab/blob/master/README.md) | [Traditional Chinese](https://github.com/kenshin/simptab/blob/master/README.tw.md) | [English](https://github.com/kenshin/simptab/blob/master/README.en.md)
  * Rework source.
  * Add multi background origin: `bing.com`, `wallhaven.cc`, `unsplash.com`, `flickr.com`, `googleartproject.com`, `500px.com`, `desktoppr.co`, `visualhunt.com`, `nasa apod`, `simptab images`.
  * Add update multi customer background.
  * Add fovorite background.
  * Add top sites.
  * Add Download new background progress.
  * Add Favorite/Upload background notification.
  * Support omnibox shortcuts.
  * Fix same version 1.0.3 bugs,include: [issues 5](https://github.com/kenshin/simptab/issues/5), [issues 7](https://github.com/kenshin/simptab/issues/7)

- 2014-08-29, Version 1.0.3
  * Fix Download background's duplication of name error.
  * Fix when first running, info and download's title exist's error.
  * Fix when background is default wallpaper, info and download's title exist's error.
  * Fix when locale not zh-cn, change knows to search link.
  * Fix change clock's font-family to `roboto.ttf`.

- 2014-08-28, Version 1.0.2
  * Add multi-language to main.html's title.
  * Open Bookmark/Apps/Histroy/Info at current tab page.
  * Add controlbar to shortcuts.

- 2014-08-22, Version 1.0.1
  * Fixed issues change SimpTab - Minimalistic New Tab Page by Chrome Extensions to SimpTab - New Tab from main.html's title.
  * Fixed issues some of the copywriting error.
  * Add website and Rote link with main.html's footer.
  * Modify sns share title multi-language.

- 2014-08-20, Version 1.0.0
  * Automatic recognition of languages (Chinese simplified, Chinese traditional, English).
  * Daily/randomly changing background from Bing.com.
  * Downloading (HD) background from Bing.com.
  * View the current background of meaning.
