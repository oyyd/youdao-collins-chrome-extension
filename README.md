# youdao-collins-chrome-extension

[![build](https://api.travis-ci.org/oyyd/youdao-collins-chrome-extension.svg?branch=master)](https://travis-ci.org/oyyd/youdao-collins-chrome-extension)

查询英文单词的[柯林斯](https://www.collinsdictionary.com/)释义的chrome扩展应用。支持划词翻译，数据来源于有道词典。接入扇贝生词本，快速记录新单词，方便未来复习。

![intro](https://oyyd.github.io/youdao-collins-chrome-extension/pics/intro.webp)

去chrome web store上[下载](https://chrome.google.com/webstore/detail/mkohdjbfagmlcaclajmadgkojelkbbfj/)

## 使用说明

- 在配置页面可以设置划词翻译的模式
  - 划词即翻译
  - 按住(meta/ctrl)键 + 划词时翻译
  - 双击划词翻译
- 快捷键`ctrl+q`打开右上角浮层，用于搜索单词
- 搜索成功的单词可以快速加入到扇贝生词本（词库，oauth接入，需要你有扇贝的帐号）中，用于复习

## 功能介绍

### 1. 为什么是柯林斯词典？

chrome store上已经有很多其他词典来满足一般的英文词语意义查询。同时我在自己的单词查询过程中发现，相比于两三个中文字的单词意思解释，柯林斯词典提供了一定的英文语境可以帮我 **更准确地** 理解一个单词的意思，并加深记忆。

当一个单词搜不到对应的柯林斯释义的时候，这个扩展应用会使用有道词典上找得到的解释。

### 2. 划词翻译

划词翻译是提高查询效率的重要一环，这个扩展提供：

- 划词即翻译
- 按住(meta/ctrl)键 + 划词时翻译
- 双击划词翻译

两种选择。当然也可以关掉划词翻译。

### 3. 有道词典数据源

改扩展的数据源来源于[有道词典](http://dict.youdao.com/)，但并没有通过api访问，而是直接获取页面内容再加工，理论上也就不会被api访问上线次数限制。

### 4. 接入扇贝生词本（词库）

市面上英语学习的软件不少，扇贝是其中之一。但我个人觉得扇贝是少数在探索如何将软件技术和语言学习有效地结合起来的产品之一，也是这个应用最后选择接入扇贝生词本的重要原因（虽然扇贝的“清空词库”功能是已经实现的功能，但却严格限制用户使用这一点，会让我这样只使用其中部分功能的用户非常费解）。通过生词本，我们每天多花一点时间复习今天碰到的单词。这让这个软件在教育、学习的层面上多了不少价值。

## 实现简介

本着一个应用的开发应验总是能帮助到其他踩到坑而又找不到有效信息的开发者的原则，这里简单介绍下这个应用的一些特点。

### 1. 用React构建UI，全内联样式

React组件的组合和复用能力非常优秀。

Chrome extension中的[content scripts](https://developer.chrome.com/extensions/content_scripts)中加入的css样式文件会影响当前页面的样式，然而我们往往只是想把这些样式用在自己的扩展上。所以这个扩展直接全部使用了内联样式来进行处理。但即便不是在content scripts这样特殊的运行环境上，我觉得使用react加内联样式也是个好主意。

jsx和内联样式意味着一个应用的绝大多数内容都储存在了js文件中，通过我们构建使用到的js模块机制统一管理。这样的应用的代码会非常容易复用和移植。

### 2. 客户端直接爬取页面获得数据

因为安全原因而产生的浏览器跨域限制导致了一般web页面不能随意拉取跨域页面的信息，然而对于同是客户端性质的Chrome Extension(content scripts仍然会受到限制)和React Native等环境而言，虽然都是js，但却不受跨域限制，并且这一点很容易被忽略。

所有这个应用的数据来源是通过[event page](https://developer.chrome.com/extensions/event_pages)爬去页面解析而成，也正是因为这个原因，我们可以不用api，只是提取加工以下原有页面的数据即可。

而js社区中好用的、css selectors形式的静态页面解析工具非[cheerio](https://github.com/cheeriojs/cheerio)莫属。但cheerio依赖node native模块，没办法直接用在Chrome Extension或React Native上。不过没关系，我稍微修改了cheerio的代码和它的依赖的代码 － [cheerio-without-node-native](https://github.com/oyyd/cheerio-without-node-native)。你可以直接利用npm安装并用在非node环境上。

### 3. chrome extension中的event page和content scripts

像前面所说，event page不受跨域等限制，而且可以充分利用`chrome.*`上的api，具有各种丰富而强大的特性。我们在content scripts上（近似一般web页面）不能做的事情都可以放到event page上，并通过chrome api将数据发送到content scripts上。

event page为了节省性能消耗会在没有唤起消息的时候进入idle状态。这点对于开发来说很麻烦，可以在开发时设置`persistent`为`true`，这样我们就可以在任何时候打开“背景”进行调试。

## 已知问题

- 对iframe中的内容不生效

## 意见反馈

[issues](https://github.com/oyyd/youdao-collins-chrome-extension/issues)

## LICENSE

[MIT](./LICENSE.md)
