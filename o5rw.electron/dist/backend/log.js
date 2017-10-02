"use strict";
var getLogger = (function () {
    var index = 0;
    return function getLogger(level) {
        level = level.toUpperCase();
        var logger = (function (index) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (this.level < index) {
                    return;
                }
                console.log.apply(console, [this.getTimestamp(), ("[" + level + "]")].concat(args));
            };
        })(index);
        index += 1;
        return logger;
    };
})();
var Log = (function () {
    function Log() {
        this.debug = getLogger("debug");
        this.info = getLogger("info");
        this.warn = getLogger("warn");
        this.error = getLogger("error");
    }
    Log.prototype.construct = function () {
        this.level = 1;
    };
    Log.prototype.setLevel = function (level) {
        this.level = level;
    };
    Log.prototype.getTimestamp = function () {
        var ts = new Date();
        var hh = ("0" + ts.getHours()).slice(-2);
        var mm = ("0" + ts.getMinutes()).slice(-2);
        var ss = ("0" + ts.getSeconds()).slice(-2);
        var ms = ("00" + ts.getMilliseconds()).slice(-3);
        return hh + ":" + mm + ":" + ss + "." + ms;
    };
    return Log;
}());
exports.log = new Log();
