//import * as electron from 'electron';
import * as log from "./log";

//let ipc = electron.ipcMain;

class Api {
    constructor() {
    }

    start() { 
        log.log.info("Starting backend APIs");
        //ipc.on("PING", this._ping.bind(this))
    }

    private _ping(event: any, data: any) {
        //log.info("<- ping", data);
        //event.sender.send("PONG", Date.now());
    }
}

export var api = new Api();
