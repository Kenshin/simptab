#### 1.5.3

> 2018-11-25

- :sparkles: 新增 [禪模式](http://ksria.com/simptab/docs/#/禅模式)；

  > 包含了：多種主題 · 模塊化 · 自定義樣式 等，適合喜歡純色背景且無干擾界面的用戶。

  ![禪模式](https://i.loli.net/2018/11/23/5bf79e09c11f6.jpg)

- :sparkles: 新增 [選項頁](http://ksria.com/simptab/docs/#/选项页)；

  ![選項頁](https://i.loli.net/2018/11/23/5bf7b165cfe22.jpg)

  > 包括以下幾個重要功能：

  - [自定義Unsplash](http://ksria.com/simptab/docs/#/%E5%A4%9A%E7%A7%8D%E8%83%8C%E6%99%AF%E6%BA%90?id=%e8%87%aa%e5%ae%9a%e4%b9%89unsplash) 以及 精選集背景的順序顯示；
  - 快捷搜索欄接入多種搜索引擎並可定製化； [#47](https://github.com/Kenshin/simptab/issues/47)

  - Topsites 在 `簡單模式 · 高級模式` 的基礎上增加了自定義的功能；

  - 全局化的自定義樣式； [#43](https://github.com/Kenshin/simptab/issues/43)

- :sparkles: 新增 自定義站點的 快捷鍵支持，觸發鍵為 z ~ `<1-9>` 號，詳細請看 [自定義站點](http://ksria.com/simptab/docs/#/%E9%80%89%E9%A1%B9%E9%A1%B5?id=%e8%87%aa%e5%ae%9a%e4%b9%89%e7%ab%99%e7%82%b9)  [#19](https://github.com/Kenshin/simptab/issues/19)

- :lipstick: 優化了  `Bookmark` `History` `Apps` 合并為一個橫向 icon bar [#46](https://github.com/Kenshin/simptab/issues/46)

  ![Xnip2018-11-24_16-42-13.jpg](https://i.loli.net/2018/11/24/5bf90f0077050.jpg)

- :fire: 去掉了 已失效的背景源 `flickr.com`；

- :bug: 修復了 [#40](https://github.com/Kenshin/simptab/issues/40) [#41](https://github.com/Kenshin/simptab/issues/41) [#46](https://github.com/Kenshin/simptab/issues/46) 錯誤；

***

#### 1.5.2

> 2018-10-14

- :sparkles: 新增 `書籤欄`；
  ![2018-10-12_141443.png](https://i.loli.net/2018/10/12/5bc03d1ce05cc.png)
  1. 需要申請許可權，側欄 → 選中 `開啟書籤欄`；

  2. 搜索（支持：`域名` 和 `標題`）
  > 點擊後，打開類似 Quick bar 的搜索。

  3. 近期使用的 URL;

- :sparkles: 新增 `背景管理器` （點擊控制欄 → 設定 → 背景管理器）
  > 詳細說明請看 (功能一覽)[http://ksria.com/simptab/docs/#/功能一覽?id=主要功能之一-1]

  ![2018-10-11_13-56-35.png](https://i.loli.net/2018/10/12/5bc03f7e85fd7.png)
  1. 開啟  `背景管理器` ；

  2. 1.5.2 包含：`收藏` 與 `訂閱` 兩個 Tab ；

  3. `收藏` 與 `訂閱` 的區別：前者可以刪除；

  4. 依次為：照片的作者 · 照片的出處 · 設置為當前背景 · 下載；

- :sparkles: 新增 `關於` 頁面；
  ![2018-10-12_144121.png](https://i.loli.net/2018/10/12/5bc0487f163d2.png)

- :sparkles: 新增 `歡迎` 頁面；
  ![2018-10-12_145647.png](https://i.loli.net/2018/10/12/5bc048bf612f8.png)

- :sparkles: 新增 `只顯示當前背景` 的選項；
  > 與 `Pin` 的區別是，選中此項後，當前背景永不再改變；後者只是固定一段時間；

  ![2018-10-12_150254.png](https://i.loli.net/2018/10/12/5bc047edc3abf.png)

- :sparkles: 新增 `刷新（下一張）` 的選項；
  > 點擊後，會在當前 New Tab 基礎上更新下一張背景；

  ![2018-10-12_151000.png](https://i.loli.net/2018/10/12/5bc049456454d.png)

- :lipstick: 優化了 `全局快捷鍵`
  > 通過全局快捷鍵 <kbd>?</kbd> 呼出

  ![快捷鍵](https://i.loli.net/2018/10/11/5bbefe9e22160.png)

- :lipstick: 優化了 `必應每日更新` `必應隨機背景` `收藏夾背景源` 的優先順序，現在可以關閉它們；

  ![2018-10-12_151532.png](https://i.loli.net/2018/10/12/5bc04a94bcb15.png)

- :hammer: 重構了頁面布局，使其更符合 HTML5 與 Material Design 風格；

- :lipstick: 優化了側欄的布局，去掉了無用的分享功能；

- :hammer: 重構了全部的字體樣式，去掉了之前 `繁體` `English` 的特殊字體方案；

- :hammer: 重構了 Tooltip，新方案使用了第三方庫 [Balloon.css](https://kazzkiq.github.io/balloon.css/)

- :hammer: 統一了 `bookmarks` 與 `setting` 的動效；

- :hammer: 重構了 `Topsites - 高級模式(九宮格)` 的 UI;

- :memo: 截至到目前全部的功能
  ![SimpTab 1.5.2](https://i.loli.net/2018/10/11/5bbf2d08da9c1.png)

***

#### 1.5.1

> 2018-08-12

- :sparkles: 增加了 全新的 **【SimpTab 精選集】**；  
  > 類似 iOS 某些壁紙 App 的方式，通過手動採集的方式更新，每周一期。  

  ![Imgur](https://i.imgur.com/pblZLv0.png)

- :sparkles: 增加了 [Waves](http://fian.my.id/Waves/) 動效；

- :sparkles: 增加了 全新的背景布局：`相框布局`；
  ![Imgur](https://i.imgur.com/7HuDEdpl.png)

- :lipstick: 優化了 界面，使其更符合 Google Metarial Design 風格； _包括：Topsites / 側欄 / Tooltip / Clock 等_

- :lipstick: 更新了 若干依賴；_包括： jQuery / Notify_

- :bug: 修復了 `bing.com 每日圖片` 無法獲取的錯誤； [issues 31](https://github.com/kenshin/simptab/issues/31) · [issues 34](https://github.com/kenshin/simptab/issues/34)

- :bug: 修復了 `隨機 bing.com` 的地址源失效問題；_新的地址來源於 [https://bingwallpaper.com/](https://bingwallpaper.com/)_

- :bug: 修復了 `收藏` 後的壁紙載入慢的問題；

- :fire: 去掉了 側欄分享的功能；

- :fire: 去掉了 已失效的背景源 `500px.com` `nasa.gov`；

***

#### 1.5.0

> 2016-02-11

- :sparkles: 增加了 `Pin` 功能；

  > 可以固定一段時間，包括： 0.5, 1, 2, 4, 8 小時

- :sparkles: 增加了 `dislike` 功能；

  > 加入後不再顯示當前背景；

- :sparkles: 增加了 背景源的 CDN 功能；

- :bug: 修復了 `checkbox/radio` 偶爾無法點擊的錯誤； [issues 16](https://github.com/kenshin/simptab/issues/16)

***

#### 1.4.3

> 2016-01-20

- :sparkles: 增加了 版本介紹；

- :sparkles: 增加了 `動態許可權設定` 功能；

- :sparkles: 增加了 `背景源的顯示位置`，包括： `居中`和 `左上角` 對其；

- :pencil2: 優化了設定欄的 icon；

***

#### 1.4.2

> 2015-12-25

- :sparkles: 增加了 新的背景源： [NASA Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html)

- :sparkles: 增加了 新的背景源： `SimpTab Images`.

***

#### 1.4.1

> 2015-12-23

- :sparkles: 常用網址增加了全新的： `高級布局` 方式；

- :bug: 調整了 `常用網址（簡單布局）` 滑鼠 hover 時的顯示速度.

- :bug: 修復 `Notifiy` z-index 錯誤； [issues 8](https://github.com/kenshin/simptab/issues/8)

***

#### 1.4.0

> 2015-12-10

- :sparkles: 增加了 多語言，包括： [Chinese Simplified](https://github.com/kenshin/simptab/blob/master/README.md) | [Traditional Chinese](https://github.com/kenshin/simptab/blob/master/README.tw.md) | [English](https://github.com/kenshin/simptab/blob/master/README.en.md)

- :sparkles: 增加了 新的背景源： `bing.com`, `wallhaven.cc`, `unsplash.com`, `flickr.com`, `googleartproject.com`, `500px.com`, `desktoppr.co`, `visualhunt.com`, `nasa apod`, `simptab images`.

- :sparkles: 增加了 `上傳背景源` 功能；

- :sparkles: 增加了 `fovorite` 功能；

- :sparkles: 增加了 `top sites` 功能；

- :sparkles: 增加了 載入新的背景源時的進度顯示；

- :sparkles: 增加了 `Favorite/Upload` 背景源的提示；

- :sparkles: 增加了 `omnibox` 快捷鍵；

- :hammer: 重構了代碼；

- :bug: 修復了 `1.0.3` 版版的錯誤，包括： [issues 5](https://github.com/kenshin/simptab/issues/5), [issues 7](https://github.com/kenshin/simptab/issues/7)

***

#### 1.0.3

> 2014-08-29

- :sparkles: 增加了 `clock's font-family` to `roboto.ttf`.

- :bug: 修復了 下載背景時重複命名的錯誤；

- :bug: 修復了 第一次安裝下載背景的錯誤；

- :bug: 修復了 默認背景下載時命名的錯誤；

- :bug: 修復了 非 `zh-cn` 環境下 `info 鏈接` 指向的錯誤；

***

#### 1.0.2

> 2014-08-28

- :sparkles: 增加了 `main.html's title` 的多語言；

- :sparkles: 增加了 `Bookmark/Apps/Histroy/Info` 在本頁打開的功能；

- :sparkles: 增加了 `controlbar` 的快捷鍵方案；

***

#### 1.0.1

> 2014-08-22

- :sparkles: 增加了 `footer 欄` 投票的鏈接；

- :pencil2: 優化了 `分享 icon` 的多語言；

- :bug: 修復了 main.html's title 為 `SimpTab - Minimalistic New Tab Page by Chrome Extensions`;

- :bug: 修復了 一些文案上的錯誤；

***

#### 1.0.0

> 2014-08-20

- :sparkles: 增加了 `多語言` 環境；

- :sparkles: 增加了 `每日/隨機` （ 從 `bing.com` ）更換背景；

- :sparkles: 增加了 `下載背景` 功能；

- :sparkles: 增加了 `info` 功能；