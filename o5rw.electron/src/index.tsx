/// <reference path="../typings/electron.d.ts" />
//import electron = require("electron");
import * as React from "react";
import * as ReactDOM from "react-dom";
import {MeteredVariac} from "./components/MeteredVariac";

var WebFont = require('webfontloader');
var nixieOne = require("./static/NixieOne.ttf");

function fontsActive () {
    var foo: number;
    ReactDOM.render(
            <div>
            <MeteredVariac />
        </div>,
    
    document.getElementById("example")
    );
  }



WebFont.load({
    custom: {
      families: ['Nixie One'],
      urls: ["https://fonts.googleapis.com/css?family=Nixie+One"]
    },
    active: fontsActive
  });