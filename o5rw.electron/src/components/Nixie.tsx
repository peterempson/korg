import * as React from "react";
import { Motivator } from "./Motivator";

interface DigitState {value: number, brightness: number, motivator: Motivator}
export class Nixie extends React.Component< {}, {} > {
    canvas: HTMLCanvasElement;
    width=100;
    physicalWidth=75;
    cx = this.width/2;
    height=150;
    cy = this.height/2;
    
    digits: DigitState[] = [];
    
    
    constructor() {
        super(  );
        let silhouettes = [1, 0, 2, 3, 9, 4, 8, 5, 7, 6];
        for (let i = 0; i < 10; i++) {
            this.digits[i] = {
                value: silhouettes[i],
                brightness: 0,
                motivator: new Motivator( {id: i, callback: this._motivatorUpdated, maxSpeed: 0.01, maxValue: 1, acceleration: 0.01 })
            };
        }
    }
    
    setValue(value: number) {
        for (let i = 0; i < 10; i++) {
            if (this.digits[i].value === value) {
                this.digits[i].motivator.setValue(1);
            } else {
                this.digits[i].motivator.setValue(0);
            }
        }
    }
    
    clear() {
        for (let i = 0; i < 10; i++) {
            this.digits[i].motivator.setValue(0);
        }
    }
    
    render() {
        return (
            <canvas width={this.width} height={this.height} style={{width: this.physicalWidth, height: this.height, paddingLeft: 5, paddingRight: 5}} ref={x => this.canvas = x} >Your browser does not support the HTML5 canvas tag.</canvas>
            );
    }

    componentDidMount() {
        this._draw();
    }

    componentWillUnmount() {
        for (let i = 0; i < 10; i++) {
            this.digits[i].motivator.stop();
        }
    }
    
    componentDidUpdate() {
        this._draw();
    }
    
    _motivatorUpdated = (id: number, brightness: number) => {
        this.digits[id].brightness = brightness;
        this.forceUpdate();
    }
    
    _draw() {
        const ctx = this.canvas.getContext( "2d" );
        this._background(ctx);
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.font = "normal 120px 'Nixie One'";
        
        let s = this.digits.concat().sort((a, b) => {return a.brightness - b.brightness});
        for (let i = 0; i < 10; i++) {
            if (s[i].brightness) {
                this._drawFlare(ctx, s[i].value, s[i].brightness, 50);
            }          
        }
        
        for (let i = 0; i < 10; i++) {
            if (this.digits[i].brightness) {
                this._drawFlare(ctx, this.digits[i].value, this.digits[i].brightness, 10);
                this._drawDigit(ctx, this.digits[i].value, this.digits[i].brightness);
            } else {
                this._drawDarkDigit(ctx, this.digits[i].value);
            }            
        }
        this._drawReflection(ctx);
        this._drawRightReflection(ctx);
        this.drawDeliniations(ctx);
    }
    
    _background(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        var grd=ctx.createLinearGradient(0, 0, this.cx, 0);
        grd.addColorStop(1, "#101010");
        grd.addColorStop(0, "#000000");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, this.cx, this.height);
        var grd2=ctx.createLinearGradient(this.cx, 0, this.width, 0);
        grd2.addColorStop(0, "#101010");
        grd2.addColorStop(1, "#050505");
        ctx.fillStyle = grd2;
        ctx.fillRect(this.cx, 0, this.width, this.height);
    }
    
    _drawFlare(ctx: CanvasRenderingContext2D, value: number, brightness: number, baseBlur: number) {
        ctx.fillStyle = this._getRgb(255, 0, 0, brightness);
        ctx.shadowColor = this._getRgb(255, 0, 0, brightness); //"#FF0000";
        ctx.shadowOffsetX = -100
        ctx.shadowBlur = baseBlur + baseBlur * brightness;
        
        for (var i = 0; i < 12; i++) {
            ctx.fillText(''+value, this.cx+100, this.cy); 
            ctx.stroke();
        }
        ctx.shadowOffsetX = 0;
        ctx.shadowBlur = 0;
    }
    
    _drawDigit(ctx: CanvasRenderingContext2D, value: number, brightness: number) {
        ctx.fillStyle = this._getRgb(255, 224, 0, brightness);
        ctx.fillText(''+value, this.cx, this.cy);  
        ctx.stroke();
    }
    
    _drawDarkDigit(ctx: CanvasRenderingContext2D, value: number) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillText(''+ value, this.cx, this.cy);
    }

    _drawReflection(ctx: CanvasRenderingContext2D) {
        var gradient = ctx.createLinearGradient(0, this.cy, 6, this.cy);
        gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;

        ctx.ellipse(0,this.cy-20, 6, this.cy*.3, 0,Math.PI*1.5,Math.PI*0.5, false);
        ctx.fill();
        

    }
    
    _drawRightReflection(ctx: CanvasRenderingContext2D) {
        var gradient = ctx.createLinearGradient(this.width, this.cy, this.width-6, this.cy);
        gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;

        ctx.ellipse(this.width,this.cy, 6, this.cy*.6, 0, Math.PI*0.5,Math.PI*1.5, false);
        ctx.fill();
        

    }
    
    drawDeliniations(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#302530";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.height);
        ctx.moveTo(this.width, 0);
        ctx.lineTo(this.width, this.height);
        ctx.stroke();
    }
    
    _getRgb(r: number, g: number, b: number, scale: number) {
        return `rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)},${scale})`;
    }
    
}
