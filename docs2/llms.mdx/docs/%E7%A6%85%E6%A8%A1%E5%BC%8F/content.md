# 禅模式 (/%E7%A6%85%E6%A8%A1%E5%BC%8F)



> 此功能最低要求 1.5.3 版本，如低于此版本，[请升级](http://ksria.com/simptab/) 到最新版本。

***

## 含义 [#含义]

比显示美景的 简 Tab 还要更加的极致简约，只显示纯色背景 ⬇

![Xnip2018-11-23\_14-27-55.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968680/simptab/simptab/235e4e85acfe5020bbb0278c12c9381c.jpg)

## 模块 [#模块]

* 时间
* 日期
* 当前网速 & 电池电量
* Topsites
* 书签栏
* 快捷搜索

## 进入 [#进入]

> 打开 简 Tab 的侧栏，选中 「启用 禅模式」后刷新 New Tab 即可。

![Xnip2018-11-23\_14-31-55.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968802/simptab/simptab/c24bcffb16b5a6d2bc9318f029032ebb.jpg)

## 退出 [#退出]

> 进入禅模式后，鼠标在右下角点击对应的 icon 或者 快捷键 <kbd>c</kbd> 打开禅模式的选项页

![Xnip2018-11-23\_14-35-23.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968803/simptab/simptab/7e29515b34d9eb227fb6ad931557e4fc.jpg)

## 功能（设置） [#功能设置]

> 这里的设置仅针对于禅模式，可通过&#x2A;*快捷键 <kbd>c</kbd>** 或 **鼠标移动右下角** 进入。

![Xnip2018-11-27\_11-37-55.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968804/simptab/simptab/3a1824f9914d51b49f090de4650eb782.jpg)

### 主题 [#主题]

包含默认的几种给定的配色。（选中后每次打开 New Tab 均显示这种颜色的背景）

* 随机

  倒数第二个选项。（选中后每次打开 New Tab 随机显示一种主题色的背景）

* 白色

  选中为白底黑字显示 New Tab

* 自定义背景色

  倒数最后一个选项。（ 支持 `CSS3 background-color` 的值）

### 模块设置 [#模块设置]

> 包含了 大小 · 以及是否显示某些模块 的功能

### 自定义样式 [#自定义样式]

> 支持自定义样式，仅作用于禅模式

### 导入 / 导出 [#导入--导出]

> 可以导入/ 导出当前配置，&#x2A;*注意：配置文件的中的版本号需与当前 简 Tab 的版本对应。**

# 自定义脚本 [#自定义脚本]

> 此功能最低要求 1.5.4.202 版本，如低于此版本，[请升级](http://ksria.com/simptab/) 到最新版本。

通过 [自定义脚本](https://github.com/Kenshin/simptab/labels/script) 可以实现多种形式的禅模式，如下图：

![Xnip2019-02-02\_15-21-38.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968804/simptab/simptab/4ba9f5708d014dc2e1aff2172c51eafa.jpg)![Xnip2019-02-02\_15-28-19.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968672/simptab/simptab/4e3a81c72aaf8da9e95ca2ee707c6c46.jpg)

# 脚本管理器 [#脚本管理器]

> 1.5.5. 新增加的脚本管理器，可对全部脚本进行 **预览、设置脚本、更新脚本管理器** 等功能。

![Q9Sm8K.png](https://res.cloudinary.com/simpread/image/upload/v1789968646/simptab/simptab/406b9967035d92c0bb8187e24638d399.png)

> 位置在 <kbd>s</kbd> → 选项页 → 脚本管理器（下方第一个 Button）打开

![Q9SoI1.png](https://res.cloudinary.com/simpread/image/upload/v1789968809/simptab/simptab/2958e132ace75d7665a8a2f049bd12ae.png)

# 预设 [#预设]

目前可以在 [这里](https://github.com/Kenshin/simptab/issues/63) 查看全部的脚本，以下是几个预设的脚本

通过 `自定义样式` 配合 [Google Fonts](https://fonts.google.com/) 可以实现不同效果的样式，如下图：

```
@import url('https://fonts.googleapis.com/css?family=Nunito:400,600,700,800,900');
@import url('https://fonts.googleapis.com/css?family=M+PLUS+1p');

#time {
    font-family: 'Nunito', sans-serif;
    font-weight: 900!important;
}

.day-zen-mode {
    margin-top: 5px!important;
    font-family: 'M PLUS 1p', sans-serif;
    font-size: 40px!important;
}
```

![Xnip2018-11-23\_14-50-55.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968810/simptab/simptab/649b64c0fa279b589c7bc6e783cdabf5.jpg)

```
@import url('https://fonts.googleapis.com/css?family=Audiowide');

#time {
    font-family: 'Audiowide', sans-serif;
    font-weight: 900!important;
}

```

![Xnip2018-11-23\_14-58-22.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968811/simptab/simptab/9e50441a6e98f035572f04ea724101c4.jpg)

```
@import url('https://fonts.googleapis.com/css?family=Press+Start+2P');

#time {
    font-family: 'Press Start 2P', sans-serif;
}
```

![Xnip2018-11-23\_15-01-16.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968813/simptab/simptab/ba9ad0fa930658d6e603930216b404cb.jpg)

```
@import url('https://fonts.googleapis.com/css?family=Audiowide|Kosugi+Maru');

#time {
    font-family: 'Audiowide', sans-serif;
    font-weight: 900!important;
}

.day-zen-mode {
    font-family: 'Kosugi Maru', sans-serif;
    font-size: 35px!important;
}

.devices-zen-mode {
    margin-top: 5px!important;
    font-family: 'Audiowide', sans-serif;
    font-size: 12px!important;
}
```

![Xnip2018-11-23\_15-07-52.jpg](https://res.cloudinary.com/simpread/image/upload/v1789968814/simptab/simptab/2439c112b434825b66081cef2e8bc6fb.jpg)
