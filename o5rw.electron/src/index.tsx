import * as React from "react";
import * as ReactDOM from "react-dom";
import {MeteredVariac} from "./components/MeteredVariac";

import * as WebFont  from 'webfontloader';

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
      urls: ["https://fonts.googleapis.com/css?family=Nixie+One",
             "https://fonts.googleapis.com/css?family=Patrick+Hand+SC"]
    },
    active: fontsActive
  });