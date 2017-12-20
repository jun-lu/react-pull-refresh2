## pull-refresh

[![npm version](https://badge.fury.io/js/pull-refresh.svg)](https://badge.fury.io/js/pull-refresh) [![npm downloads](https://img.shields.io/npm/dm/pull-refresh.svg?style=flat-square)](https://www.npmjs.com/package/pull-refresh)




## 使用


````
  
npm install pull-refresh -save

````

````

import PullRefresh from 'pull-refresh'

render(){

  return <div>
    <PullRefresh />
  </div>

}

````


## Example Source Code

* [all example](./example/)
  
  * [无需任何配置，直接使用](./example/src/base.js)
  * [监听刷新动作触发](./example/src/demo2.js)
  * [自定义刷新UI](./example/src/demo3.js)
  * [有fixed头](./example/src/demo4.js)


## props参数说明



| 参数  | 是否必要  | 默认值 | 说明 |
|:------------- |:---------------:| -------------:|-------------:|
| pullRootId    | 否              | document.body |  如果页面有fixed头需要此参数来设置下拉的element    |
| pullMaxDistance| 否        |  90  | 最大下拉的距离，也就是默认刷新提示框的高度（为了更好下拉体验，实际下拉会超过这个高度） |
| renderUI(status, progress) | 否        |   内置UI  | 参考备注1 |
| onRefresh(resolve, reject) | 否        |   内置3秒刷新完成  | resolve, reject 为promise对象方法，执行resolve后刷新完成 |






## 原理

用更优雅的方式实现移动端的下拉刷新。

1. 把下拉刷新的提示信息通过 transform 的方式移动到容器外
2. 当 `document.body.scrollTop == 0`的时候开始监听 `touchmove` 触发下拉提示信息展示。
3. 下拉的时候把容器(body或自定义的dom节点)使用 `transform` 下移，自然露出下拉提示信息
4. 下拉动画使用优化过的`easeOut`更逼近native下拉体验


