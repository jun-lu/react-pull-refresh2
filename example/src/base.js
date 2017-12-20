
import React from 'react'
import {render} from 'react-dom'
import PullRefresh from '../pull-refresh/index'

//https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=%E4%B8%AD%E5%9B%BD

class App extends React.Component{
  render(){
    return (
      <div>
        <PullRefresh />
        {
        	Object.keys(window).map((item)=>{
        		return <div className="box">{item}</div>
        	})
        }
      </div>
    )
  }
}

render(<App />, document.getElementById("root"))
