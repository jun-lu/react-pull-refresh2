
import React from 'react'
import {render} from 'react-dom'
import PullRefresh from '../pull-refresh/index'


class App extends React.Component{
  render(){
    return (
      <div>
        <PullRefresh />
        {
        	Object.keys(window).map((item)=>{
        		return <div className="box" key={item}>{item}</div>
        	})
        }
      </div>
    )
  }
}

render(<App />, document.getElementById("root"))
