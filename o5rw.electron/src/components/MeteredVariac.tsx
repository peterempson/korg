import * as React from "react";
import {Variac} from "./Variac";
import {Nixie} from "./Nixie";

export class MeteredVariac extends React.Component< {}, {} > {
    variac: Variac;
    nixie1: Nixie;
    nixie2: Nixie;
    nixie3: Nixie;

    componentDidMount() {
        this.variacUpdated(0);
    }

    render() {
        return (
                <div>
                    <Variac updated = {this.variacUpdated} ref={x => this.variac = x} />
                    <Nixie ref={x => this.nixie3 = x} /> 
                    <Nixie ref={x => this.nixie2 = x} />
                    <Nixie ref={x => this.nixie1 = x} />

                </div>
        );
    }
    
    variacUpdated = (value: number) => {
        this.nixie1.setValue(Math.floor(value) % 10);
        let d2 = Math.floor(value/10) % 10;
        let d3 = Math.floor(value/100) % 10;
        if (d2 || d3) {
            this.nixie2.setValue(d2);
        } else {
            this.nixie2.clear();
        }
        
        if (d3) {
            this.nixie3.setValue(d3);
        } else {
            this.nixie3.clear();
        }
    }
    
    componentDidUpdate() {
        //this.draw();
    }

}