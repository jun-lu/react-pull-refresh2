## pull-refresh

[![npm version](https://badge.fury.io/js/react-pull-refresh2.svg)](https://badge.fury.io/js/react-pull-refresh2) [![npm downloads](https://img.shields.io/npm/dm/react-pull-refresh2.svg?style=flat-square)](https://www.npmjs.com/package/react-pull-refresh2)




## use


````javascript
  
npm install pull-refresh -save

````

````javascript

import PullRefresh from 'pull-refresh'

render(){

  return <div>
    <PullRefresh 
    	onRefresh={(resolve)=>{
    		setTimeout(()=>{
    			resolve()
    		}, 2000)
    	}}
    />
  </div>

}

````

## GIF


<img src="https://img.alicdn.com/tfs/TB1swR4jxrI8KJjy0FpXXb5hVXa-600-1045.gif" width="300" /> <img src="https://img.alicdn.com/tfs/TB1L_yzjr_I8KJjy1XaXXbsxpXa-600-1021.gif" width="300" />



## Example Source Code

* [all example](./example/)
  
  * [无需任何配置，直接使用](./example/src/base.js)
  * [监听刷新动作触发](./example/src/demo2.js)
  * [自定义刷新UI](./example/src/demo3.js)
  * [有fixed头](./example/src/demo4.js)


## props



| 参数  | 是否必要  | 默认值 | 说明 |
|:------------- |:---------------:| -------------:|-------------:|
| pullRootId    | 否  | document.body |  如果页面有fixed头需要此参数来设置下拉的element    |
| pullMaxDistance| 否  |  90  | 最大下拉的距离，也就是默认刷新提示框的高度（为了更好下拉体验，实际下拉会超过这个高度） |
| renderUI(status, progress) | 否        |   简单ui  | [自定义刷新UI](./example/src/demo3.js) |
| onRefresh(resolve, reject) | 否        |   内置3秒刷新完成  | 调用resolve后，刷新完成 |


