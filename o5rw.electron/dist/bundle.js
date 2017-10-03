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
	var Nixie_1 = __webpack_require__(7);
	var ipc = electron.ipcRenderer;
	ipc.on("PONG", function (event, data) {
	    console.log("<- pong", data);
	    console.log(event);
	});
	//setInterval(function() {
	//    console.log("-> ping");
	//    ipc.send("PING", Date.now());
	//}, 1000);
	ReactDOM.render(React.createElement("div", null, React.createElement(Hello_1.Hello, {compiler: "TypeScript", framework: "React"}), React.createElement(Nixie_1.Nixie, null)), document.getElementById("example"));


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
	var Motivator_1 = __webpack_require__(6);
	;
	;
	var Hello = (function (_super) {
	    __extends(Hello, _super);
	    function Hello(props) {
	        var _this = this;
	        _super.call(this, props);
	        this.cx = 100;
	        this.cy = 75;
	        this.r = 30;
	        this.minTheta = 0.85 * Math.PI;
	        this.midpointTheta = .5 * Math.PI;
	        this.maxTheta = 0.15 * Math.PI;
	        this.arcLength = 2 * Math.PI - (this.minTheta - this.maxTheta);
	        this.maxTemperature = 127;
	        this.mouseMove = function (e) {
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
	            _this.motivator.setValue(Math.floor(_this.maxTemperature * m / _this.arcLength));
	        };
	        this.motivatorUpdated = function (value) {
	            _this.setState({ temperature: value });
	        };
	        this.state = {
	            temperature: 0
	        };
	        this.motivator = new Motivator_1.Motivator({ callback: this.motivatorUpdated, maxSpeed: 0.5, maxValue: this.maxTemperature, acceleration: 0.0012 });
	    }
	    Hello.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("canvas", {className: "bob", onMouseMove: this.mouseMove, ref: function (x) { return _this.canvas = x; }}, "Your browser does not support the HTML5 canvas tag."));
	    };
	    Hello.prototype.componentDidMount = function () {
	        this.motivator.start();
	        this.draw();
	    };
	    Hello.prototype.componentDidUnmount = function () {
	        this.motivator.stop();
	    };
	    Hello.prototype.componentDidUpdate = function () {
	        this.draw();
	    };
	    Hello.prototype.draw = function () {
	        var context = this.canvas.getContext("2d");
	        var gradient = context.createLinearGradient(0, 0, 150, 300);
	        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
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
	    return Hello;
	}(React.Component));
	exports.Hello = Hello;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	;
	//
	// Handles animation position with acceleration / deceleration
	// -----------------------------------------------------------
	var Motivator = (function () {
	    function Motivator(props) {
	        var _this = this;
	        this.targetValue = 0;
	        this.displayValue = 0;
	        this.speed = 0;
	        //
	        // Main animate frame call
	        // -----------------------
	        this._tick = function () {
	            var now = performance.now();
	            if (_this.lastAnimationTime && _this.targetValue !== _this.displayValue) {
	                var timePassed = now - _this.lastAnimationTime;
	                var distanceToCover = _this.targetValue - _this.displayValue;
	                _this._updateSpeed(timePassed, distanceToCover);
	                var step = _this._calculateStep(timePassed, distanceToCover);
	                if (step) {
	                    _this._updateDisplayValue(step);
	                }
	            }
	            _this.lastAnimationTime = now;
	            _this.animationRequest = requestAnimationFrame(_this._tick);
	        };
	        this.props = props;
	    }
	    //
	    // Set the target value
	    // ----------------------------
	    Motivator.prototype.setValue = function (value) {
	        this.targetValue = value;
	    };
	    //
	    // Get the current target value
	    // ----------------------------
	    Motivator.prototype.getValue = function () {
	        return this.targetValue;
	    };
	    // 
	    // Start the animationRequest cycle
	    // --------------------------------
	    Motivator.prototype.start = function () {
	        this.animationRequest = requestAnimationFrame(this._tick);
	    };
	    // 
	    // Stop the animationRequest cycle. Call on componentDidUnmount
	    // ------------------------------------------------------------
	    Motivator.prototype.stop = function () {
	        if (this.animationRequest) {
	            cancelAnimationFrame(this.animationRequest);
	        }
	    };
	    // 
	    // Calculate the current speed based on direction and proximity to target / ends
	    // -----------------------------------------------------------------------------
	    Motivator.prototype._updateSpeed = function (timePassed, distanceToCover) {
	        // Is the deceleration rate needed to stop in time higher than our deceleration?
	        var shouldSlowDown = Math.pow(this.speed, 2) / (2 * Math.abs(distanceToCover)) >= this.props.acceleration;
	        var goingUpward = distanceToCover > 0;
	        var speedDelta = timePassed * this.props.acceleration;
	        var unlimitedSpeed;
	        if (goingUpward && !shouldSlowDown || !goingUpward && shouldSlowDown) {
	            unlimitedSpeed = this.speed + speedDelta;
	        }
	        else {
	            unlimitedSpeed = this.speed - speedDelta;
	        }
	        this.speed = this._limitValue(unlimitedSpeed, this.props.maxSpeed);
	    };
	    //
	    // Calculate the new display value and hit the callback
	    // ----------------------------------------------------
	    Motivator.prototype._updateDisplayValue = function (delta) {
	        this.displayValue = this._limitValue(this.displayValue + delta, this.props.maxValue, 0);
	        this.props.callback(this.displayValue);
	        if (this.displayValue <= 0 || this.displayValue >= this.props.maxValue || this.displayValue === this.targetValue) {
	            this.speed = 0;
	        }
	    };
	    // 
	    // Calculate the amount to move the animation based on current speed
	    // -----------------------------------------------------------------
	    Motivator.prototype._calculateStep = function (timePassed, distanceToCover) {
	        var step = this.speed * timePassed;
	        var approachingTarget = this._sameSigned(distanceToCover, this.speed);
	        if (!approachingTarget) {
	            // Still decelerating away from the target
	            return step;
	        }
	        return this._limitValue(step, distanceToCover);
	    };
	    //
	    // Both positive or both negative
	    // ------------------------------
	    Motivator.prototype._sameSigned = function (a, b) {
	        return (a > 0 && b > 0) || (a < 0 && b < 0);
	    };
	    //
	    // Return  value limited to max and optionally min, retaining value's sign
	    // -----------------------------------------------------------------------
	    Motivator.prototype._limitValue = function (value, max, min) {
	        var belowMax = Math.min(Math.abs(value), Math.abs(max));
	        var result = min ? Math.max(belowMax, Math.abs(min)) : belowMax;
	        return value < 0 ? -result : result;
	    };
	    return Motivator;
	}());
	exports.Motivator = Motivator;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(3);
	var Nixie = (function (_super) {
	    __extends(Nixie, _super);
	    function Nixie() {
	        _super.call(this);
	        this.cx = 100;
	        this.cy = 75;
	    }
	    Nixie.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("canvas", {ref: function (x) { return _this.canvas = x; }}, "Your browser does not support the HTML5 canvas tag."));
	    };
	    Nixie.prototype.componentDidMount = function () {
	    };
	    return Nixie;
	}(React.Component));
	exports.Nixie = Nixie;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map