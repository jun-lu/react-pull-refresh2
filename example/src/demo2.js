
import React from 'react'
import {render} from 'react-dom'
import PullRefresh from '../pull-refresh/index'


class App extends React.Component{
  render(){
    return (
      <div>
        <PullRefresh 
        	onRefresh={(resolve)=>{
        		alert("onRefresh");
        		setTimeout(()=>{
        			resolve()
        		}, 2000)
        	}}
        />
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
