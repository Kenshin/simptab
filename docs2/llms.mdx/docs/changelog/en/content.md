# Changelog (English) (/docs/changelog/en)



#### 1.6.0.819 [#160819]

> 2026-08-26

* :sparkles: Added Minor version updates now only show an update notification

* :sparkles: Added Upload images now supports multi-image upload

* :art: Improved Album mode visual update
  ![image-20260826121545528](https://res.cloudinary.com/simpread/image/upload/v1787717747/config/001afaed7851f1e29fd747cbfe7c2556.png)

* :bug: Fixed White background issue in frame mode [#144](https://github.com/Kenshin/simptab/issues/141)

* :bug: Fixed Dialog being blocked by the top-right control bar at smaller sizes

* :bug: Fixed Unable to use background upload feature; added multi-image upload support

* :bug: Fixed Background Manager → Favorites Tab deletion error

* :bug: Fixed Background Manager → Explore Tab occasionally failing to load

* :bug: Fixed Zen mode not showing scripts after importing versions prior to 1.6.0

#### 1.6.0 [#160]

> 2026-08-19

* :building\_construction: Rebuild MV3 adaptation

* :art: Liquid Glass UI

  > including: Control Bar / Bookmarks Bar / History / Frequently Visited / Options Tab / Background Manager / Script Manager / Notifications / White Noise / Shortcuts Overview → optimized show/hide logic + modern UI/UE + updated icons + semi-transparent background with auto contrast adjustment

  ![image-20260826121816596](https://res.cloudinary.com/simpread/image/upload/v1787717898/config/2ecb1e23ba13fdbed331117e7ba791dd.png)

* :lipstick: Improved Script Manager → switched to built-in script solution

* :sparkles: Added Search: integrated browser history (off by default; enable in Options → Bookmarks Bar)

* :bug: Fixed Bing random background source: using new source [bing.npanuhin.me](https://bing.npanuhin.me/) (multi-market yearly archive JSON + `_UHD` 3840×2160; falls back to official last 8 days on failure)

* :bug: Fixed Earth Live background source: direct connection to NICT Himawari (`latest.json` + four `2d/550` tile stitching), deprecated the now-offline `simptab.now.sh` proxy

* :bug: Fixed Unsplash.com background source: using official API; users can also enter their own Access Key

* :bug: Fixed Unsplash.it background source: renamed to Lorem Picsum with updated display logic

* :bug: Fixed Google Art background source: restored

* :bug: Fixed Removed SimpTab Curated / desktoppr.co / visualhunt.com background sources

#### 1.5.5 [#155]

> 2019-11-27

* :sparkles: Add Custom New Tab title

* :sparkles: Add 12/24 hour convert

* :sparkles: Add Zen mode scripts manage

  ![](https://res.cloudinary.com/simpread/image/upload/v1789968646/simptab/simptab/406b9967035d92c0bb8187e24638d399.png)

* :sparkles: Add Fullscreen

* :sparkles: Add Custom scripts

* :sparkles: Add Guide syste

* :sparkles: Add <kbd>esc</kbd>

* :sparkles: Add <kbd>\`</kbd> open/close Zen mode

* :lipstick: Optimize Background image show/hide effect performance

* :lipstick: Optimize All popup Window effect performance

* :lipstick: Optimize Setting bar items

* :lipstick: Optimize Options UI

* :lipstick: Optimize Bookmarks History open/close performance

* :lipstick: Optimize Controlbar Pin changed to Dropbox UI

* :lipstick: Optimize Earth changed notify logic

* :lipstick: Optimize `ESC` logic

* :bug: Fix Bing random background origin bug

* :bug: Fix Setting scrollbar error bug

* :bug: Fix  [Issues Bugs](https://github.com/Kenshin/simptab/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

* :memo: All features
  ![SimpTab 1.5.5](https://res.cloudinary.com/simpread/image/upload/v1789968672/simptab/simptab/0051810111fc5bc2719733c1201a860f.png)

***

#### 1.5.4.303 [#154303]

> 2019-03-31

* :bug: Fix `Zen mode` background auto play bug
* :bug: Fix `Zen mode` Histroy can be usage bug
* :bug: Fix `Background Manage` style bug

***

#### 1.5.4.202 [#154202]

> 2019-02-02

* :bug: Fix `Bookmark` & `Send to mobile` shortcuts repeated questions
* :sparkles: Add `Custom Script` via Zen mode, you can usage js write zen-mode

  ![Xnip2019-02-02\_15-28-19.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968672/simptab/simptab/4e3a81c72aaf8da9e95ca2ee707c6c46.jpg)

***

#### 1.5.4 [#154]

> 2018-12-31

* :sparkles: Add Earth every moment

  > Earth every moment image via [向日葵-8號](http://himawari8.nict.go.jp/)

  ![Xnip2018-12-28\_14-33-18.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968674/simptab/simptab/a10bf60d8723ba3bdfa357252cb12834.jpg)

* :sparkles: Add auto play background

* :sparkles: Add History background image record

  ![Xnip2018-12-28\_14-12-53.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968676/simptab/simptab/c4fcf844927c356f1f4fd0d0c632c3fb.jpg)

* :sparkles: Add Explore

* :sparkles: Add White noise

  ![Xnip2018-12-28\_14-50-20.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968677/simptab/simptab/84161a95f2ac703da9a380de45bc78e7.jpg)

* :sparkles: Add Send background image to iOS devices

* :lipstick: Optimize background download logic

* :lipstick: Optimize options UI

* :memo: 1.5.4 All Feature
  ![SimpTab 1.5.4](https://res.cloudinary.com/simpread/image/upload/v1789968678/simptab/simptab/c0e0c4b2d7838ffc74ad393f74bc6374.png)

***

#### 1.5.3.1129 [#1531129]

> 2018-11-29

* :sparkles: Add Custom Unsplash resolution
  ![Xnip2018-11-30\_11-45-10.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968679/simptab/simptab/607d6d8faf57f1855962b85e63b0e9c2.jpg)

* :bug: Fix `Custom Unsplash origin` bug

* :bug:  Fix  disable origin can be work bug

* :bug: Fix all origins disable logic bug

***

#### 1.5.3.1127 [#1531127]

> 2018-11-27

* :bug: First into Zen mode can't find option bug [#51](https://github.com/Kenshin/simptab/issues/51)

* :bug: Global options and Zen mode options can be multiple open bug

***

#### 1.5.3 [#153]

> 2018-11-25

* :sparkles: Add [Zen mode](http://ksria.com/simptab/docs/#/禅模式)

  ![禅模式](https://res.cloudinary.com/simpread/image/upload/v1789968680/simptab/simptab/235e4e85acfe5020bbb0278c12c9381c.jpg)

* :sparkles: Add [Options](http://ksria.com/simptab/docs/#/选项页)

  ![Options](https://res.cloudinary.com/simpread/image/upload/v1789968681/simptab/simptab/8b37f5d101e90bbb01c82724f54d515d.jpg)

  > Include some important feature:

  * [Custom Unsplash](http://ksria.com/simptab/docs/#/%E5%A4%9A%E7%A7%8D%E8%83%8C%E6%99%AF%E6%BA%90#%e8%87%aa%e5%ae%9a%e4%b9%89unsplash) and **subscribe background in sequence**

  * Quick bar add multi-search[#47](https://github.com/Kenshin/simptab/issues/47)

  * Custom Topsites

  * Custom Golbal CSS [#43](https://github.com/Kenshin/simptab/issues/43)

* :lipstick: Add Custom Topsites shortcuts, trigger key is z \~ `<1-9>`, more about [Custom Topsites](http://ksria.com/simptab/docs/#/%E9%80%89%E9%A1%B9%E9%A1%B5#%e8%87%aa%e5%ae%9a%e4%b9%89%e7%ab%99%e7%82%b9)  [#19](https://github.com/Kenshin/simptab/issues/19)

* :lipstick: Optimize Merge `Bookmark` `History` `Apps` [#46](https://github.com/Kenshin/simptab/issues/46)

![Xnip2018-11-24\_16-42-13.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968682/simptab/simptab/3324f723a1ddfbd36e4161e15f4a6299.jpg)

* :fire: Remove failed origins: `flickr.com`

* :bug: Fix [#40](https://github.com/Kenshin/simptab/issues/40) [#41](https://github.com/Kenshin/simptab/issues/41) [#46](https://github.com/Kenshin/simptab/issues/46) Bug

***

#### 1.5.2 [#152]

> 2018-10-14

* :sparkles: Add `Bookmarks`
  ![2018-10-12\_141443.png](https://res.cloudinary.com/simpread/image/upload/v1789968684/simptab/simptab/a2b4809fc53d314104bc1ccaadd124af.png)

  1. Need to apply for permission

  2. Search, support: `domain` & `title` keywords

  > Search box like Quick bar style.

  3. Recent

* :sparkles: Add `Background Manage`

  > For details, please see (Feature)\[[http://ksria.com/simptab/docs/#/功能一览?id=主要功能之一-1](http://ksria.com/simptab/docs/#/功能一览?id=主要功能之一-1)]

  ![2018-10-11\_13-56-35.png](https://res.cloudinary.com/simpread/image/upload/v1789968685/simptab/simptab/a2c85d77d2d38e29c88d14eba0551670.png)

  1. Open  `Background Manage`

  2. Include: `Favorite` 与 `Subscibe` Tab

  3. `Favorite` 与 `Subscibe` difference between, `Favorite`  can be remove

  4. In this order: Author · Photos link · Set photo to background · Download

* :sparkles: Add `About page`
  ![2018-10-12\_144121.png](https://res.cloudinary.com/simpread/image/upload/v1789968687/simptab/simptab/86ac3b820189c151eb21f3620a22a22b.png)

* :sparkles:  Add `Welcome page`
  ![2018-10-12\_145647.png](https://res.cloudinary.com/simpread/image/upload/v1789968688/simptab/simptab/3f4a0376a897a69feb8c919612064a3b.png)

* :sparkles: Add `Not Change background` checkitem

  ![2018-10-12\_150254.png](https://res.cloudinary.com/simpread/image/upload/v1789968689/simptab/simptab/cbad6ed5389b60f159280a6423346c8e.png)

* :sparkles: Add `Refresh` checkitem

  ![2018-10-12\_151000.png](https://res.cloudinary.com/simpread/image/upload/v1789968690/simptab/simptab/a5efed5c5357d9eaf611225f2b185ec2.png)

* :lipstick: Optimize `shortcuts`

  ![快捷键](https://res.cloudinary.com/simpread/image/upload/v1789968691/simptab/simptab/b14f2b5e6a8b11146c34e6e37d9bde45.png)

* :lipstick: Optimize `Bing today` `Bing random` `Favorite origins` priority

  ![2018-10-12\_151532.png](https://res.cloudinary.com/simpread/image/upload/v1789968693/simptab/simptab/795485add43d62f1ec9d62918ec79d55.png)

* :hammer: Rework `main.html` layout

* :lipstick: Optimize setting bar layout

* :hammer: Optmize all `font-family`

* :hammer: Rework Tooltip,  new scheme uses a third-party library [Balloon.css](https://kazzkiq.github.io/balloon.css/)

* :hammer: Unified `bookmarks` 与 `setting` Effect

* :hammer: Rework `Topsites - senior` UI

* :memo: 1.5.2 All feature
  ![SimpTab 1.5.2](https://res.cloudinary.com/simpread/image/upload/v1789968693/simptab/simptab/7062c432e5c809e56fa6cdc01f0da1df.png)

***

#### 1.5.1 [#151]

> 2018-08-12

* :sparkles: Add &#x2A;*【SimpTab Collections】**

  ![Imgur](https://res.cloudinary.com/simpread/image/upload/v1789968694/simptab/simptab/697b4f2188c8c2fa0cbc6e0475f0425a.png)

* :sparkles: Add [Waves](http://fian.my.id/Waves/) Effect

* :lipstick: Optimize UI，like Google Metarial Design *Include: Topsites / Setting / Tooltip / Clock*

* :arrow\_up: Update venders *Include: jQuery / Notify*

* :bug: Fix `bing.com Today` not work bug [issues 31](https://github.com/kenshin/simptab/issues/31) · [issues 34](https://github.com/kenshin/simptab/issues/34)

* :bug: Fix `bing.com Random` not work bug &#x2A;origin from [https://bingwallpaper.com/](https://bingwallpaper.com/)*

* :bug: Fix `favorite` loading slow bug

* :fire: Remove Setting bar sharde

* :fire: Remove failed origins: `500px.com` `nasa.gov`

***

#### 1.5.0 [#150]

> 2016-02-11

* :sparkles: Add pin feature.

* :sparkles: Add dislike feature.

* :sparkles: Add background remote cdns feature.

* :bug: Fix checkbox/radio item click invalid bug. [issues 16](https://github.com/kenshin/simptab/issues/16)

***

#### 1.4.3 [#143]

> 2016-01-20

* :sparkles: More detailed version for version feature.

* :sparkles: Dynamic set permissions.

* :sparkles: Add background position item, intelligent adjusting background position.

* :pencil2: Modify settin bar icon.

***

#### 1.4.2 [#142]

> 2015-12-25

* :sparkles: Add new background: [NASA Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html)

* :sparkles: Add special day(SimpTab Images) to Setting bar.

***

#### 1.4.1 [#141]

> 2015-12-23

* :sparkles: Add 'senior' and 'normal' topsites.( old topsites only 'simple' mode.)

* :bug: Fix 'simple' mode topsites hover display speed.

* :bug: Fix notifiaction show z-index bug. [issues 8](https://github.com/kenshin/simptab/issues/8)

***

#### 1.4.0 [#140]

> 2015-12-10

* :sparkles: Feature: [Chinese Simplified](https://github.com/kenshin/simptab/blob/master/README.md) | [Traditional Chinese](https://github.com/kenshin/simptab/blob/master/README.tw.md) | [English](https://github.com/kenshin/simptab/blob/master/README.en.md)

* :sparkles: Add multi background origin: `bing.com`, `wallhaven.cc`, `unsplash.com`, `flickr.com`, `googleartproject.com`, `500px.com`, `desktoppr.co`, `visualhunt.com`, `nasa apod`, `simptab images`.

* :sparkles: Add update multi customer background.

* :sparkles: Add fovorite background.

* :sparkles: Add top sites.

* :sparkles: Add Download new background progress.

* :sparkles: Add Favorite/Upload background notification.

* :sparkles: Add Support omnibox shortcuts.

* :hammer: Rework source.

* :bug: Fix same version 1.0.3 bugs,include: [issues 5](https://github.com/kenshin/simptab/issues/5), [issues 7](https://github.com/kenshin/simptab/issues/7)

***

#### 1.0.3 [#103]

> 2014-08-29

* :bug: Fix Download background's duplication of name error.

* :bug: Fix when first running, info and download's title exist's error.

* :bug: Fix when background is default wallpaper, info and download's title exist's error.

* :bug: Fix when locale not zh-cn, change knows to search link.

* :bug: Fix change clock's font-family to `roboto.ttf`.

***

#### 1.0.2 [#102]

> 2014-08-28

* :sparkles: Add multi-language to main.html's title.

* :sparkles: Add open Bookmark/Apps/Histroy/Info at current tab page.

* :sparkles: Add controlbar to shortcuts.

***

#### 1.0.1 [#101]

> 2014-08-22

* :sparkles: Add website and Rote link with main.html's footer.

* :pencil2: Modify sns share title multi-language.

* :bug: Fixed issues change SimpTab - Minimalistic New Tab Page by Chrome Extensions to SimpTab - New Tab from main.html's title.

* :bug: Fixed issues some of the copywriting error.

***

#### 1.0.0 [#100]

> 2014-08-20

* :sparkles: Add Automatic recognition of languages (Chinese simplified, Chinese traditional, English).

* :sparkles: Add Daily/randomly changing background from Bing.com.

* :sparkles: Add Downloading (HD) background from Bing.com.

* :sparkles: Add View the current background of meaning.
