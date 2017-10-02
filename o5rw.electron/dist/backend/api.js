"use strict";
var electron = require('electron');
var log_1 = require("./log");
var ipc = electron.ipcMain;
var Api = (function () {
    function Api() {
    }
    Api.prototype.start = function () {
        log_1.log.info("Starting backend APIs");
        //ipc.on("PING", this._ping.bind(this))
    };
    Api.prototype._ping = function (event, data) {
        //log.info("<- ping", data);
        //event.sender.send("PONG", Date.now());
    };
    return Api;
}());
exports.api = new Api();
