/// <reference path="../typings/node.d.ts" />
/// <reference path="../typings/electron.d.ts" />
"use strict";
var electron = require('electron');
require('electron-debug')({ showDevTools: true });
var log_1 = require('./backend/log');
var api_1 = require('./backend/api');
var app = electron.app;
var settings = {
    width: 800,
    height: 600
};
function findRoot() {
    return __dirname + "/..";
}
var ROOT = findRoot();
var RELEASE = "file://" + ROOT + "/index.html";
var Main = (function () {
    function Main() {
        app.on('ready', this.init.bind(this));
    }
    Main.prototype.init = function () {
        var _this = this;
        log_1.log.info("Electron ready");
        api_1.api.start();
        app.on('window-all-closed', function () {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
        app.on('activate', function () {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (this.mainWindow === null) {
                this.createWindow();
            }
        }.bind(this));
        this.createWindow();
        this.mainWindow.webContents.on('did-finish-load', function () {
            _this.mainWindow.show();
            _this.mainWindow.focus();
        });
    };
    Main.prototype.createWindow = function () {
        log_1.log.info("Creating new main window");
        this.mainWindow = new electron.BrowserWindow({
            show: false,
            width: settings.width,
            height: settings.height
        });
        this.mainWindow.on("closed", function () {
            this.mainWindow = null;
        }.bind(this));
        var url = RELEASE;
        if (process.argv.indexOf("--dev") !== -1) {
            log_1.log.info("Developer mode enabled!");
        }
        log_1.log.info("Opening " + url);
        this.mainWindow.loadURL(url);
    };
    return Main;
}());
var main = new Main();
