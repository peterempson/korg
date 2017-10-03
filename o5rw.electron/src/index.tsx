/// <reference path="../typings/electron.d.ts" />
import electron = require("electron");
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Hello} from "./components/Hello";
import {Nixie} from "./components/Nixie";

let ipc = electron.ipcRenderer;

ipc.on("PONG", function (event: any, data: any) {
    console.log("<- pong", data);
    console.log(event);
});

//setInterval(function() {
//    console.log("-> ping");
//    ipc.send("PING", Date.now());
//}, 1000);

ReactDOM.render(
        <div>
            <Hello compiler="TypeScript" framework="React"/>
            <Nixie />
        </div>,
    
    document.getElementById("example")
);
