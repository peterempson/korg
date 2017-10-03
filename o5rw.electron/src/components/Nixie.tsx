import * as React from "react";
import { Motivator } from "./Motivator";

export class Nixie extends React.Component< {},  {}> {
    canvas: HTMLCanvasElement;
    cx = 100;
    cy = 75;
    
    constructor() {
        super(  );
    }
    
    render() {
        return (
            <canvas ref={x => this.canvas = x}>Your browser does not support the HTML5 canvas tag.</canvas>
        );
    }

    componentDidMount() {
       
    }

}
