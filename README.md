# (WIP)youdao-collins-chrome-extension

[![build](https://api.travis-ci.org/oyyd/youdao-collins-chrome-extension.svg?branch=master)](https://travis-ci.org/oyyd/youdao-collins-chrome-extension)

查询单词的[柯林斯](https://www.collinsdictionary.com/)释义的chrome扩展应用。支持划词翻译，数据来源于有道词典。

TODO: store link

## 功能介绍

### 1. 为什么是柯林斯词典？

chrome store上已经有很多其他词典来满足一般的英文词语意义查询。同时我在自己的单词查询过程中发现，相比于两三个中文字的单词意思解释，柯林斯词典提供了一定的英文语境可以帮我 **更准确地** 理解一个单词的意思，并加深记忆。

### 2. 划词翻译

划词翻译是提高查询效率的重要一环，这个扩展提供：

- 划词即翻译
- 按住(meta/ctrl)键 + 划词时翻译

两种选择。当然也可以关掉划词翻译。

### 3. 有道词典数据源

改扩展的数据源来源于[有道词典](http://dict.youdao.com/)，但并没有通过api访问，而是直接获取页面内容再加工，理论上也就不会被api访问上线次数限制。

### 4. 关于(接入)生词本

目前并没有，要比较好地提供可能会让这个扩展的功能本末倒置。或许接入现有成熟应用的生词本是个不错的注意？如果有什么好想法的话，欢迎直接在issue上反馈。

## 程序设计

本着一个应用的开发应验总是能帮助到其他踩到坑而又找不到有效信息的开发者的原则，这里简单介绍下这个应用的一些特点。

### 1. 用React构建UI，全内联样式

React组件的组合和复用能力是我熟悉的前端框架中最优秀的。

![a](a)

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

MIT
