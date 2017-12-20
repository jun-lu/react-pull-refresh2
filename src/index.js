
import React from 'react'


const STATUS_NONE = "none";
const STATUS_PULL = "pull";
const STATUS_READY = "readyRefresh";
const STATUS_REFRESH = "refresh";


/**
	props = {
		
		pullRootId:"", //element id default document.body
		pullMaxDistance:90, //下拉距离
		renderUI(status, progress){} //
		onRefresh(resolve, reject){
			setTimeout(()=>{
				resolve()
			}, 3000)
		}

	}
*/

export default class PullRefresh extends React.Component{

	constructor(props){
		super(props);

		this.touchStarthandle = this.touchStarthandle.bind(this);
		this.touchMovehandle = this.touchMovehandle.bind(this);
		this.touchEndhandle = this.touchEndhandle.bind(this);

		this.state = {
			progress:0,
			startPageY:0,
			status:STATUS_NONE,//pull,refresh,none
		}

		//下拉阻力大小
		this.damping = 3;

		//默认下拉刷新的高度
		this.defaultPullUIHeight = 90;

		//判断touchmove的px
		this.isTouchMoveMaxPX = 5;
		//刷新阈值
		this.refreshThreshold = 0.5;
	}


	componentDidMount(){

		this.pullRoot = this.props.pullRootId  ? byId(this.props.pullRootId) : document.body;

		document.addEventListener("touchstart", this.touchStarthandle, false);
		document.addEventListener("touchmove", this.touchMovehandle, false);
		document.addEventListener("touchend", this.touchEndhandle, false);

	}


	componentWillUnMount(){
		document.removeEventListener("touchstart", this.touchStarthandle, false);
		document.removeEventListener("touchmove", this.touchMovehandle, false);
		document.removeEventListener("touchend", this.touchEndhandle, false);
	}



	getPullMaxDistance(){
		return this.props.pullMaxDistance ? this.props.pullMaxDistance : this.defaultPullUIHeight;
	}

	touchStarthandle(e){
		let scrollTop = document.body.scrollTop;
		let {status} = this.state;
		if(scrollTop == 0 && status == STATUS_NONE){
			let {progress} = this.state;
			this.setState({
				startPageY:e.touches[0].pageY,
				progress:0
			});
		}
	}

	touchMovehandle(e){

		let {status, startPageY} = this.state;

		let scrollTop = document.body.scrollTop;
		let changePageY = e.touches[0].pageY - startPageY;
		let progress = 0;
		//&& (status == STATUS_PULL || status == STATUS_READY)
		if(scrollTop == 0  && changePageY > 0){
			//此解决android手机必须通过 e.preventDefault(); 解决move只触发一次，end不触发的问题
			if(changePageY >= this.isTouchMoveMaxPX){
				e.preventDefault();
			}

			progress = changePageY/(this.getPullMaxDistance()*this.damping);

			this.setState({
				status:progress > this.refreshThreshold ? STATUS_READY : STATUS_PULL,
				progress:progress
			});

		}else{
			this.setState({
				progress:0
			})
		}

	}

	touchEndhandle(e){

		let {status} = this.state;
		//需要刷新
		if(status == STATUS_READY){
			new Promise((resolve, reject)=>{

				this.setState({
					status:STATUS_REFRESH
				});

				this.onRefresh(resolve, reject);

			}).then((a)=>{

				this.setState({
					progress:0,
					status:STATUS_NONE
				});
				this.resetPullRefresh();

			}).catch((e)=>{

				this.setState({
					progress:0,
					status:STATUS_NONE
				});
				this.resetPullRefresh();
				
			});

		}else{
			
			this.setState({
				progress:0,
				status:STATUS_NONE
			});

			if(status !== STATUS_NONE){
				this.resetPullRefresh();
			}
		}
		
	}


	//触发刷新
	onRefresh(resolve, reject){

		if(this.props.onRefresh){
			this.props.onRefresh(resolve, reject);
		}else{
			setTimeout(()=>{
				resolve()
			}, 3000);
		}
	}

	renderUI(status, progress){

		if(this.props.renderUI){
			return this.props.renderUI(status, progress)
		}else{
			let text = "";

			if(status == STATUS_NONE){
				text = "下拉刷新";
			}

			if(status == STATUS_PULL){
				text = "下拉刷新";
			}

			if(status == STATUS_READY){
				text = "松开刷新";
			}

			if(status == STATUS_REFRESH){
				text = "正在刷新";
			}
			
			return <div style={refreshStyle(this.getPullMaxDistance())}><span>{text}</span></div>
		}
	}

	//重置
	resetPullRefresh(){
		setTransition(this.pullRoot);
		setTransform(this.pullRoot, 0);
		clearTransitionAndTransform(this.pullRoot, 300);
	}

	render(){

		let {progress, startPageY, status} = this.state;
		
		if(status !== STATUS_NONE){
			removeTransition(this.pullRoot);
			setTransform(this.pullRoot, easeOut(progress, 0, this.getPullMaxDistance(), 1) );
		}


		return this.props.renderUI ? this.props.renderUI(status, progress) : this.renderUI(status, progress);
	}

};


function byId(id){
	return document.getElementById(id);
}


function easeOut(t,b,c,d){
	
	if(t > d){
		t = d + (t - d)/t
	}
	
	return c*((t=t/d-1)*t*t+ 1) + b;
}

window.easeOut = easeOut;

//元素上不能保留 transform 的痕迹，否则页面渲染可能会有后遗症
function setTransition(pullRoot){
	pullRoot.style.webkitTransition = "-webkit-transform .3s ease-out";
	pullRoot.style.transition = "transform .3s ease-out";
}

function removeTransition(pullRoot){
	pullRoot.style.transition = "inherit";
}

function setTransform(pullRoot, translateY){
	pullRoot.style.webkitTransform = "translateY("+ translateY +"px)";
	pullRoot.style.transform = "translateY("+ translateY +"px)";
}

let timeout = null;
function clearTransitionAndTransform(pullRoot, timeout){
	timeout && clearTimeout(timeout)
	timeout = setTimeout(()=>{
		pullRoot.style.webkitTransition = "inherit";
		pullRoot.style.transition = "inherit";
		pullRoot.style.webkitTransform = "inherit";
		pullRoot.style.transform = "inherit";
	}, timeout);

}



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



PullRefresh.STATUS_NONE = STATUS_NONE;
PullRefresh.STATUS_PULL = STATUS_PULL;
PullRefresh.STATUS_READY = STATUS_READY;
PullRefresh.STATUS_REFRESH = STATUS_REFRESH;
