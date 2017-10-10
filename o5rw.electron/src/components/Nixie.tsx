import * as React from "react";
import { Motivator } from "./Motivator";

interface Point{x: number, y: number};
export interface NixieState {value: number}

export class Nixie extends React.Component< {}, NixieState > {
    canvas: HTMLCanvasElement;
    cx = 100;
    cy = 75;
    motivator: Motivator;
    silhouettes = [1, 0, 2, 3, 9, 4, 8, 5, 7, 6];
    
    constructor() {
        super(  );
        this.motivator = new Motivator( {callback: this.motivatorUpdated, maxSpeed: 0.5, maxValue: 255, acceleration: 0.0012 });
        this.state = {
            value: 0
        };
    }
    
    setValue(value: number) {
        this.setState({value: value});
    }
    
    render() {
      
        return (
            <canvas ref={x => this.canvas = x} className="bob">Your browser does not support the HTML5 canvas tag.</canvas>
            );
    }

    componentDidMount() {
        this.motivator.start();
        this.draw(this.state.value);
    }
    
    motivatorUpdated = (value: number) => {
        //this.setState({value: value});
    }
    
    componentWillUnmount() {
        this.motivator.stop();
    }
    
    componentDidUpdate() {
        this.draw(this.state.value);
    }
    
    draw(a: number) {
        const ctx = this.canvas.getContext( "2d" );
    
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Big flare, black text
        ctx.shadowColor = "#FF0000";
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.fillStyle = '#000000';
        ctx.font = "normal 120px 'Nixie One'";
        ctx.shadowBlur = 100;
        for (var i = 0; i < 12; i++) {
            ctx.fillText(''+a, this.cx, this.cy);  
        }
        ctx.stroke();

        // Tight flare
        ctx.shadowBlur = 20;
        for (var i = 0; i < 4; i++) {
            ctx.fillText(''+a, this.cx, this.cy);  
        }
        
        // Draw character
        ctx.fillStyle = '#ffE000';
        ctx.fillText(''+a, this.cx, this.cy);  
        ctx.stroke();
        
        // Draw silhouettes 
        var ix = this.silhouettes.indexOf(a);
        if (ix != -1) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
            for (var i = ix + 1; i < 10; i++) {
                ctx.fillText(''+this.silhouettes[i], this.cx, this.cy);
            }
        }
    }
    
}
