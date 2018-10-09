<p align="center"><img src="http://st.ksria.cn/logo@192.png" /></p>
<h1 align="center">簡 Tab - 極簡的 Chrome 新標籤頁擴展</h1>
<p align="center">望你每次打開都有好心情；去除多餘功能，只關註標簽頁呈現效果。</p>
<p align="center">
   <a href="https://github.com/kenshin/simptab/releases"><img src="https://img.shields.io/badge/lastest_version-1.5.1-blue.svg"></a>
   <a target="_blank" href="http://ksria.com/simptab"><img src="https://img.shields.io/badge/website-_simptab.ksria.com-1DBA90.svg"></a>
   <a target="_blank" href="https://chrome.google.com/webstore/detail/simptab-new-tab/kbgmbmkhepchmmcnbdbclpkpegbgikjc"><img src="https://img.shields.io/badge/download-_chrome_webstore-brightgreen.svg"></a>
   <a href="http://ksria.com/simptab/crx/1.5.1/simptab.crx"><img src="https://img.shields.io/badge/download-_crx-brightgreen.svg"></a>
</p>

***

下載
---
[Chrome 應用商店](https://chrome.google.com/webstore/detail/simptab-new-tab/kbgmbmkhepchmmcnbdbclpkpegbgikjc) 或者 [離線下載](http://ksria.com/simptab/crx/1.5.1/simptab.crx)

詳細介紹
---
https://github.com/Kenshin/simptab

版本說明
---

#### 1.5.1

> 2018-08-12

- [x] :sparkles: 增加了 全新的 **【SimpTab 精選集】**；  
  > 類似 iOS 某些壁紙 App 的方式，通過手動採集的方式更新，每周一期。  

  ![Imgur](https://i.imgur.com/pblZLv0.png)

- [x] :sparkles: 增加了 [Waves](http://fian.my.id/Waves/) 動效；
- [x] :sparkles: 增加了 全新的背景布局：`相框布局`；
  ![Imgur](https://i.imgur.com/7HuDEdpl.png)

- [x] :lipstick: 優化了 界面，使其更符合 Google Metarial Design 風格； _包括：Topsites / 側欄 / Tooltip / Clock 等_
- [x] :arrow_up: 更新了 若干依賴；_包括： jQuery / Notify_

- [x] :bug: 修復了 `bing.com 每日圖片` 無法獲取的錯誤； [issues 31](https://github.com/kenshin/simptab/issues/31) · [issues 34](https://github.com/kenshin/simptab/issues/34)
- [x] :bug: 修復了 `隨機 bing.com` 的地址源失效問題；_新的地址來源於 [https://bingwallpaper.com/](https://bingwallpaper.com/)_
- [x] :bug: 修復了 `收藏` 後的壁紙載入慢的問題；

- [x] :fire: 去掉了 側欄分享的功能；
- [x] :fire: 去掉了 已失效的背景源 `500px.com` `nasa.gov`；

***

#### 1.5.0

> 2016-02-11

- [x] :sparkles: 增加了 `Pin` 功能；
  > 可以固定一段時間，包括： 0.5, 1, 2, 4, 8 小時

- [x] :sparkles: 增加了 `dislike` 功能；
  > 加入後不再顯示當前背景；

- [x] :sparkles: 增加了 背景源的 CDN 功能；
- [x] :bug: 修復了 `checkbox/radio` 偶爾無法點擊的錯誤； [issues 16](https://github.com/kenshin/simptab/issues/16)

***

#### 1.4.3

> 2016-01-20

- [x] :sparkles: 增加了 版本介紹；
- [x] :sparkles: 增加了 `動態許可權設定` 功能；
- [x] :sparkles: 增加了 `背景源的顯示位置`，包括： `居中`和 `左上角` 對其；

- [x] :pencil2: 優化了設定欄的 icon；

***

#### 1.4.2

> 2015-12-25

- [x] :sparkles: 增加了 新的背景源： [NASA Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html)
- [x] :sparkles: 增加了 新的背景源： `SimpTab Images`.

***

#### 1.4.1

> 2015-12-23

- [x] :sparkles: 常用網址增加了全新的： `高級布局` 方式；

- [x] :bug: 調整了 `常用網址（簡單布局）` 滑鼠 hover 時的顯示速度.
- [x] :bug: 修復 `Notifiy` z-index 錯誤； [issues 8](https://github.com/kenshin/simptab/issues/8)

***

#### 1.4.0

> 2015-12-10

- [x] :sparkles: 增加了 多語言，包括： [Chinese Simplified](https://github.com/kenshin/simptab/blob/master/README.md) | [Traditional Chinese](https://github.com/kenshin/simptab/blob/master/README.tw.md) | [English](https://github.com/kenshin/simptab/blob/master/README.en.md)
- [x] :sparkles: 增加了 新的背景源： `bing.com`, `wallhaven.cc`, `unsplash.com`, `flickr.com`, `googleartproject.com`, `500px.com`, `desktoppr.co`, `visualhunt.com`, `nasa apod`, `simptab images`.
- [x] :sparkles: 增加了 `上傳背景源` 功能；
- [x] :sparkles: 增加了 `fovorite` 功能；
- [x] :sparkles: 增加了 `top sites` 功能；
- [x] :sparkles: 增加了 載入新的背景源時的進度顯示；
- [x] :sparkles: 增加了 `Favorite/Upload` 背景源的提示；
- [x] :sparkles: 增加了 `omnibox` 快捷鍵；

- [x] :hammer: 重構了代碼；

- [x] :bug: 修復了 `1.0.3` 版版的錯誤，包括： [issues 5](https://github.com/kenshin/simptab/issues/5), [issues 7](https://github.com/kenshin/simptab/issues/7)

***

#### 1.0.3

> 2014-08-29

- [x] :sparkles: 增加了 `clock's font-family` to `roboto.ttf`.

- [x] :bug: 修復了 下載背景時重複命名的錯誤；
- [x] :bug: 修復了 第一次安裝下載背景的錯誤；
- [x] :bug: 修復了 默認背景下載時命名的錯誤；
- [x] :bug: 修復了 非 `zh-cn` 環境下 `info 鏈接` 指向的錯誤；

***

#### 1.0.2

> 2014-08-28

- [x] :sparkles: 增加了 `main.html's title` 的多語言；
- [x] :sparkles: 增加了 `Bookmark/Apps/Histroy/Info` 在本頁打開的功能；
- [x] :sparkles: 增加了 `controlbar` 的快捷鍵方案；

***

#### 1.0.1

> 2014-08-22

- [x] :sparkles: 增加了 `footer 欄` 投票的鏈接；

- [x] :pencil2: 優化了 `分享 icon` 的多語言；

- [x] :bug: 修復了 main.html's title 為 `SimpTab - Minimalistic New Tab Page by Chrome Extensions`;
- [x] :bug: 修復了 一些文案上的錯誤；

***

#### 1.0.0

> 2014-08-20

- [x] :sparkles: 增加了 `多語言` 環境；
- [x] :sparkles: 增加了 `每日/隨機` （ 從 `bing.com` ）更換背景；
- [x] :sparkles: 增加了 `下載背景` 功能；
- [x] :sparkles: 增加了 `info` 功能；
