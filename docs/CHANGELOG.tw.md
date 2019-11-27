#### 1.5.5

> 2019-11-27

- :sparkles: 新增 [12/24 制式轉換](选项页?id=时间)

- :sparkles: 新增 [自定義標題欄](选项页?id=自定义标题)

- :sparkles: 新增 [禪模式 · 腳本管理器](禅模式?id=脚本管理器)

  ![](https://s2.ax1x.com/2019/11/27/Q9Sm8K.png)

- :sparkles: 新增 [全屏](控制栏?id=全屏化)

- :sparkles: 新增 [自定義下載文件夾](背景源?id=自定义下载位置)

- :sparkles: 新增 [全局性自定義腳本](选项页?id=自定义脚本)

- :sparkles: 新增 **新手引導**

- :sparkles: 新增 <kbd>esc</kbd> 退出方案，支持絕大多數界面/功能

- :sparkles: 新增 <kbd>`</kbd> 進入/退出 [禅模式](禅模式)

- :lipstick:  優化 **背景進入/更換** 時的緩動效果

- :lipstick:  優化 **界面彈出** 時的效率

- :lipstick:  優化 [設置欄](设置栏) 的項目設置，去掉了與背景無關的項目，將其轉移到了 [选项页](选项页) 

- :lipstick:  優化 [选项页](选项页)  的界面設計

- :lipstick:  優化 [書籤欄](书签栏) [歷史記錄](历史记录) 太過靈活的問題

- :lipstick:  優化 [固定](控制栏?id=固定) 改為 `Dropdown` 方式

- :lipstick: 優化 [地球每刻](背景源?id=地球每刻) [過頻繁的更新提示](https://github.com/Kenshin/simptab/issues/59)

- :bug: 修復 全局 `ESC` 退出邏輯混亂的問題

- :bug: 修復 [快捷搜索欄](书签栏?id=快捷搜索栏) 的各種相關問題

- :bug: 修復 [設置欄](设置栏) 滾動條錯誤的問題

- :bug: 修復 [Issues Bugs](https://github.com/Kenshin/simptab/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

- :bug: 修復  [固定](控制栏?id=固定) 邏輯，優先順序高於 [歷史記錄](历史记录) `自動播放` `刷新（下一張）` 小於 `地球每刻`

***

#### 1.5.4.330

> 2019-03-31

> **本次更新為靜默更新（不會有任何提示）**

- :bug: 修復 `禪模式` 下自動播放的錯誤；
- :bug: 修復 `禪模式` 下歷史背景可用的錯誤；
- :bug: 修復 `背景管理器` 的樣式錯誤；

#### 1.5.4.202

> 2019-02-02

> **本次更新為靜默更新（不會有任何提示）**

- :bug: 修復 `書籤欄` 與 `發送到手機` 快捷鍵重複的問題， `發送到手機` 改為 快捷鍵 `e`
- :sparkles: 新增 禪模式 `自定義腳本`，通過此功能，只需要使用簡單的 JavaScript 可以讓禪模式擁有更多 **玩法**  👉 <https://github.com/Kenshin/simptab/labels/script>

  ![Xnip2019-02-02_15-28-19.jpg](https://i.loli.net/2019/02/02/5c55469fdb4a1.jpg)

***

#### 1.5.4

> 2018-12-31

> 本次更新的摘要說明，[請看這裡](http://ksria.com/simptab/welcome/version_1.5.4.html)

- :sparkles: 新增 [地球每刻](多种背景源?id=地球每刻)；

  > 地球每刻的照片均來自 向日葵-8號 ，由於不願過多消耗向日葵-8號的帶寬，通過簡 Tab 訪問並獲取到的地球照片均來在於自建的服務，每小時更新一次。

  ![Xnip2018-12-28_14-33-18.jpg](https://i.loli.net/2018/12/28/5c25c57aa4589.jpg)

- :sparkles: 新增 [背景自動更新](多种背景源?id=背景自动更新)

- :sparkles: 新增 [歷史記錄](多种背景源?id=历史记录)

  ![Xnip2018-12-28_14-12-53.jpg](https://i.loli.net/2018/12/28/5c25bfb86f655.jpg)

- :sparkles: 新增 [探索](多种背景源?id=探索)

  > 背景管理器增加了新的 Tab - 探索，通過它可以隨機顯示來自 [自定義Unsplash](多种背景源?id=自定义Unsplash) 的精美壁紙。

- :sparkles: 新增 [白噪音](白噪音)

  > 得益於 [背景自動播放](多种背景源?id=背景自动播放) 與 [地球每刻](多种背景源?id=地球每刻) 功能，現在你可以在新標籤頁停留更多的時間，播放白噪音就是一個非常不錯的方案。目前內置了：咖啡館、爵士樂、下雨天、雷聲 四種音效，未來會加入更多音源。

  ![Xnip2018-12-28_14-50-20.jpg](https://i.loli.net/2018/12/28/5c25c7c50db43.jpg)

- :sparkles: 新增 [發送到手機](发送到手机)

  > 藉助 JSBox 可以將新標籤頁中的背景發送到手機端（ iOS 設備）上了。

- :lipstick: 優化了`下載背景到本地` 的演算法；

- :lipstick: 優化了 `選項卡` 界面布局；

- :memo: 截至到目前全部的功能
  ![SimpTab 1.5.4](https://i.loli.net/2018/12/29/5c270d58131ea.png)

***

#### 1.5.3.1129

> 2018-11-29

> **本次更新為靜默更新（不會有任何提示）**

- :sparkles: 新增 更改 Unsplash 源解析度；詳情請看 [自定義解析度](多種背景源?id=自定義解析度)
  ![Xnip2018-11-30_11-45-10.jpg](https://i.loli.net/2018/11/30/5c00b254426b3.jpg)

- :bug: 修復 `自定義 Unsplash 源` 的邏輯錯誤；

- :bug:  修復 已 disable 的背景源仍在工作的錯誤；

- :bug: 修復 當取消全部背景源時的邏輯錯誤；

***

#### 1.5.3.1127

> 2018-11-27

> **本次更新為靜默更新（不會有任何提示）** ，主要修復以下兩個問題：

- :bug: 進入禪模式後，不容易找到選項卡的問題； [#51](https://github.com/Kenshin/simptab/issues/51)

- :bug: （全局）選項頁 · （禪模式）選項頁重複開啟的問題；

***

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
