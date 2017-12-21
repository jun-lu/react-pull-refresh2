"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STATUS_NONE = "none";
var STATUS_PULL = "pull";
var STATUS_READY = "readyRefresh";
var STATUS_REFRESH = "refresh";

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

var PullRefresh = function (_React$Component) {
	_inherits(PullRefresh, _React$Component);

	function PullRefresh(props) {
		_classCallCheck(this, PullRefresh);

		var _this = _possibleConstructorReturn(this, (PullRefresh.__proto__ || Object.getPrototypeOf(PullRefresh)).call(this, props));

		_this.touchStarthandle = _this.touchStarthandle.bind(_this);
		_this.touchMovehandle = _this.touchMovehandle.bind(_this);
		_this.touchEndhandle = _this.touchEndhandle.bind(_this);

		_this.state = {
			progress: 0,
			startPageY: 0,
			status: STATUS_NONE //pull,refresh,none


			//下拉阻力大小
		};_this.damping = 3;

		//默认下拉刷新的高度
		_this.defaultPullUIHeight = 90;

		//判断touchmove的px
		_this.isTouchMoveMaxPX = 5;
		//刷新阈值
		_this.refreshThreshold = 0.5;
		return _this;
	}

	_createClass(PullRefresh, [{
		key: "componentDidMount",
		value: function componentDidMount() {

			this.pullRoot = this.props.pullRootId ? byId(this.props.pullRootId) : document.body;

			document.addEventListener("touchstart", this.touchStarthandle, false);
			document.addEventListener("touchmove", this.touchMovehandle, false);
			document.addEventListener("touchend", this.touchEndhandle, false);
		}
	}, {
		key: "componentWillUnMount",
		value: function componentWillUnMount() {
			document.removeEventListener("touchstart", this.touchStarthandle, false);
			document.removeEventListener("touchmove", this.touchMovehandle, false);
			document.removeEventListener("touchend", this.touchEndhandle, false);
		}
	}, {
		key: "getPullMaxDistance",
		value: function getPullMaxDistance() {
			return this.props.pullMaxDistance ? this.props.pullMaxDistance : this.defaultPullUIHeight;
		}
	}, {
		key: "touchStarthandle",
		value: function touchStarthandle(e) {
			var scrollTop = document.body.scrollTop;
			var status = this.state.status;

			if (scrollTop == 0 && status == STATUS_NONE) {
				var progress = this.state.progress;

				this.setState({
					startPageY: e.touches[0].pageY,
					progress: 0
				});
			}
		}
	}, {
		key: "touchMovehandle",
		value: function touchMovehandle(e) {
			var _state = this.state,
			    status = _state.status,
			    startPageY = _state.startPageY;


			var scrollTop = document.body.scrollTop;
			var changePageY = e.touches[0].pageY - startPageY;
			var progress = 0;
			//&& (status == STATUS_PULL || status == STATUS_READY)
			if (scrollTop == 0 && changePageY > 0) {
				//此解决android手机必须通过 e.preventDefault(); 解决move只触发一次，end不触发的问题
				if (changePageY >= this.isTouchMoveMaxPX) {
					e.preventDefault();
				}

				progress = changePageY / (this.getPullMaxDistance() * this.damping);

				this.setState({
					status: progress > this.refreshThreshold ? STATUS_READY : STATUS_PULL,
					progress: progress
				});
			} else {
				this.setState({
					progress: 0
				});
			}
		}
	}, {
		key: "touchEndhandle",
		value: function touchEndhandle(e) {
			var _this2 = this;

			var status = this.state.status;
			//需要刷新

			if (status == STATUS_READY) {
				new Promise(function (resolve, reject) {

					_this2.setState({
						status: STATUS_REFRESH
					});

					_this2.onRefresh(resolve, reject);
				}).then(function (a) {

					_this2.setState({
						progress: 0,
						status: STATUS_NONE
					});
					_this2.resetPullRefresh();
				}).catch(function (e) {

					_this2.setState({
						progress: 0,
						status: STATUS_NONE
					});
					_this2.resetPullRefresh();
				});
			} else {

				this.setState({
					progress: 0,
					status: STATUS_NONE
				});

				if (status !== STATUS_NONE) {
					this.resetPullRefresh();
				}
			}
		}

		//触发刷新

	}, {
		key: "onRefresh",
		value: function onRefresh(resolve, reject) {

			if (this.props.onRefresh) {
				this.props.onRefresh(resolve, reject);
			} else {
				setTimeout(function () {
					resolve();
				}, 3000);
			}
		}
	}, {
		key: "renderUI",
		value: function renderUI(status, progress) {

			if (this.props.renderUI) {
				return this.props.renderUI(status, progress);
			} else {
				var text = "";

				if (status == STATUS_NONE) {
					text = "下拉刷新";
				}

				if (status == STATUS_PULL) {
					text = "下拉刷新";
				}

				if (status == STATUS_READY) {
					text = "松开刷新";
				}

				if (status == STATUS_REFRESH) {
					text = "正在刷新";
				}

				return _react2.default.createElement(
					"div",
					{ style: refreshStyle(this.getPullMaxDistance()) },
					_react2.default.createElement(
						"span",
						null,
						text
					)
				);
			}
		}

		//重置

	}, {
		key: "resetPullRefresh",
		value: function resetPullRefresh() {
			setTransition(this.pullRoot);
			setTransform(this.pullRoot, 0);
			clearTransitionAndTransform(this.pullRoot, 300);
		}
	}, {
		key: "render",
		value: function render() {
			var _state2 = this.state,
			    progress = _state2.progress,
			    startPageY = _state2.startPageY,
			    status = _state2.status;


			if (status !== STATUS_NONE) {
				removeTransition(this.pullRoot);
				setTransform(this.pullRoot, easeOut(progress, 0, this.getPullMaxDistance(), 1));
			}

			return this.props.renderUI ? this.props.renderUI(status, progress) : this.renderUI(status, progress);
		}
	}]);

	return PullRefresh;
}(_react2.default.Component);

exports.default = PullRefresh;
;

function byId(id) {
	return document.getElementById(id);
}

function easeOut(t, b, c, d) {

	if (t > d) {
		t = d + (t - d) / t;
	}

	return c * ((t = t / d - 1) * t * t + 1) + b;
}

window.easeOut = easeOut;

//元素上不能保留 transform 的痕迹，否则页面渲染可能会有后遗症
function setTransition(pullRoot) {
	pullRoot.style.webkitTransition = "-webkit-transform .3s ease-out";
	pullRoot.style.transition = "transform .3s ease-out";
}

function removeTransition(pullRoot) {
	pullRoot.style.transition = "inherit";
}

function setTransform(pullRoot, translateY) {
	pullRoot.style.webkitTransform = "translateY(" + translateY + "px)";
	pullRoot.style.transform = "translateY(" + translateY + "px)";
}

var timeout = null;
function clearTransitionAndTransform(pullRoot, timeout) {
	timeout && clearTimeout(timeout);
	timeout = setTimeout(function () {
		pullRoot.style.webkitTransition = "inherit";
		pullRoot.style.transition = "inherit";
		pullRoot.style.webkitTransform = "inherit";
		pullRoot.style.transform = "inherit";
	}, timeout);
}

function refreshStyle(height) {
	var _ref;

	return _ref = {
		"height": height + "px",
		"display": "-webkit-box"
	}, _defineProperty(_ref, "display", "-ms-flexbox"), _defineProperty(_ref, "display", "flex"), _defineProperty(_ref, "WebkitBoxPack", "center"), _defineProperty(_ref, "MsFlexPack", "center"), _defineProperty(_ref, "justifyContent", "center"), _defineProperty(_ref, "WebkitBoxAlign", "center"), _defineProperty(_ref, "MsFlexAlign", "center"), _defineProperty(_ref, "alignItems", "center"), _defineProperty(_ref, "fontSize", "12px"), _defineProperty(_ref, "position", "absolute"), _defineProperty(_ref, "top", "0"), _defineProperty(_ref, "width", "100%"), _defineProperty(_ref, "WebkitTransform", "translateY(-" + height + "px)"), _defineProperty(_ref, "transform", "translateY(-" + height + "px)"), _defineProperty(_ref, "color", "#999"), _ref;
};

PullRefresh.STATUS_NONE = STATUS_NONE;
PullRefresh.STATUS_PULL = STATUS_PULL;
PullRefresh.STATUS_READY = STATUS_READY;
PullRefresh.STATUS_REFRESH = STATUS_REFRESH;