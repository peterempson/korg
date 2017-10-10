import * as React from "react";
import {Variac} from "./Variac";
import {Nixie} from "./Nixie";

export class MeteredVariac extends React.Component< {}, {} > {
    variac: Variac;
    nixie1: Nixie;

    render() {
        return (
                <div>
                    <Variac updated = {this.variacUpdated} ref={x => this.variac = x} />
                    <Nixie ref={x => this.nixie1 = x} />
                </div>
        );
    }
    
    variacUpdated = (value: number) => {
        this.nixie1.setValue(Math.floor(value/10) % 10);
    }
    
    componentDidUpdate() {
        //this.draw();
    }

}