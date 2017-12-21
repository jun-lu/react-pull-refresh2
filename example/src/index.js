
import React from 'react'
import {render} from 'react-dom'
import PullRefresh from '../pull-refresh/index'

//https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=%E4%B8%AD%E5%9B%BD

class App extends React.Component{
  render(){
    return (
      <div>
        <PullRefresh />
        <a href="./base.html" className="box">无需任何配置，直接使用</a>
		    <a href="./demo2.html" className="box">可监听刷新动作触发</a>
		    <a href="./demo3.html" className="box">自定义刷新UI</a>
		    <a href="./demo4.html" className="box">有fixed头</a>
      </div>
    )
  }
}

render(<App />, document.getElementById("root"))
