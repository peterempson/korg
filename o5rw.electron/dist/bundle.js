/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../typings/electron.d.ts" />
	var electron = __webpack_require__(2);
	var React = __webpack_require__(3);
	var ReactDOM = __webpack_require__(4);
	var Hello_1 = __webpack_require__(5);
	var ipc = electron.ipcRenderer;
	ipc.on("PONG", function (event, data) {
	    console.log("<- pong", data);
	    console.log(event);
	});
	//setInterval(function() {
	//    console.log("-> ping");
	//    ipc.send("PING", Date.now());
	//}, 1000);
	ReactDOM.render(React.createElement(Hello_1.Hello, {compiler: "TypeScript", framework: "React"}), document.getElementById("example"));


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("electron");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = React;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = ReactDOM;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(3);
	;
	;
	var Hello = (function (_super) {
	    __extends(Hello, _super);
	    function Hello(props) {
	        var _this = this;
	        _super.call(this, props);
	        this.targetTemperature = 0;
	        this.cx = 100;
	        this.cy = 75;
	        this.r = 30;
	        this.minTheta = 0.85 * Math.PI;
	        this.midpointTheta = .5 * Math.PI;
	        this.maxTheta = 0.15 * Math.PI;
	        this.arcLength = 2 * Math.PI - (this.minTheta - this.maxTheta);
	        this.maxTemperature = 127;
	        this.speed = 0;
	        this.maxSpeed = .3;
	        this.acceleration = 0.001;
	        this.doTheMouse = function (e) {
	            var theta = Math.PI + Math.atan2(_this.cy - e.clientY, _this.cx - e.clientX); // 0 East, .5 Pi South
	            if (theta > _this.midpointTheta && theta < _this.minTheta) {
	                theta = _this.minTheta;
	            }
	            else if (theta <= _this.midpointTheta && theta > _this.maxTheta) {
	                theta = _this.maxTheta;
	            }
	            var m = theta - _this.minTheta;
	            if (m < 0) {
	                m += 2 * Math.PI;
	            }
	            _this.targetTemperature = Math.floor(_this.maxTemperature * m / _this.arcLength);
	        };
	        this.tick = function () {
	            var now = performance.now();
	            if (_this.lastAnimation) {
	                var delta = _this.calculateDelta(now - _this.lastAnimation, _this.targetTemperature);
	                if (delta) {
	                    var temp = _this._restrict(_this.state.temperature + delta, 0, _this.maxTemperature);
	                    _this.setState({ temperature: temp });
	                    if (temp === 0 || temp === _this.maxTemperature || temp === _this.targetTemperature) {
	                        _this.speed = 0;
	                    }
	                }
	            }
	            _this.lastAnimation = now;
	            requestAnimationFrame(_this.tick);
	        };
	        this.state = {
	            temperature: 0
	        };
	    }
	    Hello.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("canvas", {onMouseMove: this.doTheMouse, ref: function (x) { return _this.canvas = x; }}, "Your browser does not support the HTML5 canvas tag."));
	    };
	    Hello.prototype.calculateDelta = function (timePassed, target) {
	        if (target === this.state.temperature) {
	            return 0;
	        }
	        var delta = target - this.state.temperature;
	        var speedDelta = timePassed * this.acceleration;
	        var slowDown = Math.pow(this.speed, 2) / (2 * Math.abs(delta)) >= this.acceleration;
	        //if (slowDown)
	        if (target > this.state.temperature) {
	            this.speed = this._getLimited(this.speed + speedDelta, this.maxSpeed);
	        }
	        else {
	            this.speed = this._getLimited(this.speed - speedDelta, this.maxSpeed);
	        }
	        var step = this.speed * timePassed;
	        if (this._oppositeSigned(step, delta)) {
	            // Still decelerating away from the target
	            return step;
	        }
	        return this._getLimited(step, delta);
	    };
	    Hello.prototype.componentDidUpdate = function () {
	        this.draw();
	    };
	    Hello.prototype.componentDidMount = function () {
	        requestAnimationFrame(this.tick);
	        this.draw();
	    };
	    Hello.prototype.draw = function () {
	        var context = this.canvas.getContext("2d");
	        var gradient = context.createLinearGradient(0, 0, 150, 300);
	        gradient.addColorStop(0, '#100');
	        gradient.addColorStop(1, '#000');
	        context.fillStyle = gradient;
	        context.fillRect(0, 0, 300, 300);
	        context.strokeStyle = '#ffE000';
	        context.beginPath();
	        context.arc(100, 75, 60, 0.85 * Math.PI, 0.15 * Math.PI);
	        context.moveTo(this.cx, this.cy);
	        this.drawLine(context, this.state.temperature);
	        context.shadowBlur = 5;
	        context.shadowColor = "rgb(255,0,0)";
	        context.shadowBlur = 20;
	        context.lineWidth = 3;
	        context.stroke();
	        context.stroke();
	    };
	    Hello.prototype.drawLine = function (context, value) {
	        var theta = value / this.maxTemperature * this.arcLength + this.minTheta;
	        var q = this.cx + this.r * Math.cos(theta), w = this.cy + this.r * Math.sin(theta);
	        context.moveTo(q, w);
	        var e = q + this.r * Math.cos(theta), t = w + this.r * Math.sin(theta);
	        context.lineTo(e, t);
	    };
	    Hello.prototype._oppositeSigned = function (a, b) {
	        return (a > 0 && b < 0) || (a < 0 && b > 0);
	    };
	    Hello.prototype._getLimited = function (a, b) {
	        var a_ = Math.abs(a);
	        var b_ = Math.abs(b);
	        if (a_ < b_) {
	            return a;
	        }
	        else if (a < 0) {
	            return -b_;
	        }
	        return b_;
	    };
	    Hello.prototype._restrict = function (value, min, max) {
	        return Math.min(Math.max(value, min), max);
	    };
	    return Hello;
	}(React.Component));
	exports.Hello = Hello;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map