
import React from 'react'
import {render} from 'react-dom'
import PullRefresh from '../pull-refresh/index'

//https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=%E4%B8%AD%E5%9B%BD


function refreshStyle(height){
	return {
		"height":height+"px",
	  "display":"-webkit-box",
	  "display":"-ms-flexbox",
	  "display":"flex",
	  "WebkitBoxPack":"center",
	  "MsFlexPack":"center",
	  "justifyContent":"center",
	  "WebkitBoxAlign":"center",
	  "MsFlexAlign":"center",
	  "alignItems":"center",
	  "fontSize":"12px",
	  "position":"absolute",
	  "top":"0",
	  "width":"100%",
	  "WebkitTransform":"translateY(-"+height+"px)",
	  "transform":"translateY(-"+height+"px)",
	  "color":"#999"
  }
};

class App extends React.Component{
  render(){
    return (
      <div>
      	<div className="box" style={{position:"fixed",top:0,left:0,height:60, width:"100%","zIndex":1}}>Fixed header</div>
      	<div style={{marginTop:90}} id="abc">
	        <PullRefresh pullRootId="abc" />
	        {
	        	Object.keys(window).map((item)=>{
	        		return <div className="box" key={item}>{item}</div>
	        	})
	        }
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById("root"))
