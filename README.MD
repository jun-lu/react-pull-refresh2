## pull-refresh

[![npm version](https://badge.fury.io/js/pull-refresh.svg)](https://badge.fury.io/js/pull-refresh) [![npm downloads](https://img.shields.io/npm/dm/pull-refresh.svg?style=flat-square)](https://www.npmjs.com/package/pull-refresh)


## 介绍

用更优雅的方式实现移动端的下拉刷新。

1. 把下拉刷新的提示信息通过 transform 的方式移动到容器外
2. 当 `document.body.scrollTop == 0`的时候依然在`touchemove`就会开始监听下拉动作。
3. 下拉的时候把容器(body或自定义的dom节点)使用 `transform` 下移，自然露出 下拉提示信息
4. 下拉使用优化过的`easeOut`更逼近native下拉体验


## 如何使用


````
  
npm install pull-refresh -save

````

只需要一行代码，即可安装完成

````

import PullRefresh from 'pull-refresh'

render(){

  return <div>
    <PullRefresh />
  </div>

}

````

## props参数说明


pullRootId:"", //element id default document.body
    pullMaxDistance:90, //下拉距离
    renderUI(status, progress){} //
    onRefresh(resolve, reject){
      setTimeout(()=>{
        resolve()
      }, 3000)
    }

const STATUS_NONE = "none";
const STATUS_PULL = "pull";
const STATUS_READY = "readyRefresh";
const STATUS_REFRESH = "refresh";



| 参数  | 是否必要  | 默认值 | 说明 |
|:------------- |:---------------:| -------------:|-------------:|
| pullRootId    | 否              | document.body |  如果页面有fixed头需要此参数来设置下拉的element    |
| pullMaxDistance| 否        |  90  | 最大下拉的距离，也就是默认刷新提示框的高度（为了更好下拉体验，实际下拉会超过这个高度） |
| renderUI(status, progress) | 否        |   内置UI  | 参考备注1 |
| onRefresh(resolve, reject) | 否        |   内置3秒刷新完成  | resolve, reject 为promise对象方法，执行resolve后刷新完成 |

* 备注1

 [自定义刷新UI](./example/src/demo3.js)

````

  <PullRefresh 
    renderUI={(status, progress)=>{
      //progress 0 ~ 1 的小数，方便你定制更细节的ui, 不断下拉会大于1
      let text = "";

      if(status == STATUS_NONE){//默认 progress == 0
        text = "下拉刷新";
      }

      if(status == STATUS_PULL){//默认 0.5 > progress > 0
        text = "下拉刷新";
      }

      if(status == STATUS_READY){//默认 1 > progress > 0.5
        text = "松开刷新";
      }

      if(status == STATUS_REFRESH){// progress > 0.5的时候touchend
        text = "正在刷新";
      }

      //请注意这里的div，请提前设置移动到容器上方
      return <div style={{transfrom:"translateY(-90px)"}} ><span>{text}</span></div>
    }}
  />

````




## Example


## Example Source Code

* [all example](./example/)
  
  * [无需任何配置，直接使用](./example/src/base.js)
  * [监听刷新动作触发](./example/src/demo2.js)
  * [自定义刷新UI](./example/src/demo3.js)
  * [有fixed头](./example/src/demo4.js)

