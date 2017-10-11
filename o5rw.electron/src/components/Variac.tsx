import * as React from "react";
import { Motivator } from "./Motivator";
import { Nixie } from "./Nixie";

export interface VariacProps { updated: Function };
export interface VariacState {temperature: number};
export class Variac extends React.Component<VariacProps, VariacState> {
    canvas: HTMLCanvasElement;
    width=250;
    cx = this.width/2;
    height=250;
    cy = this.height/2;
    r = 60;
    rr=100;
    motivator: Motivator;

    minTheta = 0.65 * Math.PI;
    midpointTheta = .5 * Math.PI;
    maxTheta = 0.35 * Math.PI;
    arcLength = 2 * Math.PI - ( this.minTheta - this.maxTheta )
    maxTemperature = 127;
    
    
    constructor( props: VariacProps ) {
        super( props );
        this.state = {
            temperature: 0
        };
        
        this.motivator = new Motivator( {id: 1, callback: this.motivatorUpdated, maxSpeed: 0.5, maxValue: this.maxTemperature, acceleration: 0.0012 });
    }
    
    render() {
        return (
            <canvas width={this.width} height={this.height} className="bob" onMouseMove={this.mouseMove} ref={x => this.canvas = x}>Your browser does not support the HTML5 canvas tag.</canvas>
        );
    }

    mouseMove = ( e: React.MouseEvent<HTMLCanvasElement> ) => {
        let mouseX =  e.clientX - this.canvas.offsetLeft;
        let clientY = e.clientY - this.canvas.offsetTop;
        var theta = Math.PI + Math.atan2( this.cy - clientY, this.cx - mouseX );
        if (theta > this.midpointTheta && theta < this.minTheta) {
            theta = this.minTheta
        } else if (theta <= this.midpointTheta && theta > this.maxTheta) {
            theta = this.maxTheta
        }
        var m = theta - this.minTheta 
        if (m < 0) {
            m += 2 * Math.PI;
        }
        
        this.motivator.setValue(Math.floor(this.maxTemperature * m / this.arcLength));
    }
    
    componentDidMount() {
        this.draw();
    }
    
    motivatorUpdated = (id: number, value: number) => {
        this.setState({temperature: value});
        
    }
    
    componentWillUnmount() {
        this.motivator.stop();
    }
    
    componentDidUpdate() {
        this.draw();
        this.props.updated(this.state.temperature)
    }

    draw() {
        
        const theta = this.state.temperature / this.maxTemperature * this.arcLength + this.minTheta;
        const ctx = this.canvas.getContext( "2d" );

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        this.drawBevel(ctx, theta, this.rr);
        this.drawMarks(ctx, theta, this.rr, 32);
        this.drawArrow(ctx, theta, this.rr-30);
        this.drawKnob(ctx, theta, this.rr-30);
        this.drawBand(ctx, theta);
//        
//        ctx.beginPath();
//
//        ctx.moveTo( this.cx, this.cy )
//        
        
    }

    
    drawBevel(ctx: CanvasRenderingContext2D, theta: number, radius: number) {
        let x = this.cx + 10*Math.cos(theta+.2*Math.PI);
        let y = this.cy + 10*Math.sin(theta+.2*Math.PI);
        var grd=ctx.createRadialGradient(x, y, 50, x, y, radius+8);
        grd.addColorStop(0, "#101010");
        grd.addColorStop(1, "#403040");

        ctx.beginPath();
        ctx.arc( this.cx, this.cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.strokeStyle ="#605060"
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    drawMarks(ctx: CanvasRenderingContext2D, theta: number, radius: number, markCount: number) {
        let v = 2 * Math.PI / markCount
        let x = this.cx + 10*Math.cos(theta-.8 * Math.PI);
        let y = this.cy + 10*Math.sin(theta-.8 * Math.PI);
        var grd=ctx.createRadialGradient(x, y, 50, x, y, radius+8);
        grd.addColorStop(1, "#605060");
        grd.addColorStop(0, "#807080");
        
        ctx.beginPath();
        for (let i= 0; i < markCount; i++) {
            let alpha = theta+v/2 + i * v;
            ctx.moveTo(this.cx + (radius-14) * Math.cos(alpha), this.cy + (radius-14) * Math.sin(alpha));
            ctx.lineTo(this.cx + radius*Math.cos(alpha), this.cy+radius*Math.sin(alpha))
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = grd;
        ctx.stroke();
        
    }
    
    drawArrow( ctx: CanvasRenderingContext2D, theta: number, radius: number) {
        const alpha = Math.PI*0.15;
        const x1 = this.cx + (radius+10) * Math.cos(theta),
            y1 = this.cy + (radius+10) * Math.sin( theta )
        const x2 = x1 - 15 * Math.cos(theta + alpha),
            y2 = y1 - 15 * Math.sin(theta + alpha)
        const x3 = x1 - 15 * Math.cos(theta - alpha),
            y3 = y1 - 15 * Math.sin(theta - alpha)
            
        ctx.beginPath();
        ctx.moveTo( x1, y1 );
        ctx.lineTo( x2, y2 );
        ctx.lineTo( x3, y3 );
        ctx.closePath();
        
        ctx.fillStyle = "#150505";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#605060";
        ctx.stroke();
    }
    
    drawKnob(ctx: CanvasRenderingContext2D, theta: number, radius: number) {
        let perferationRadius = 15;
        let perferationPosition = radius+6;
        let perferationAngle = 1/8 * Math.PI;
        let chord = 2 * radius * Math.sin(perferationAngle/2);
        let smallTheta = Math.asin(chord/2/perferationRadius);        
        let startAngle = theta + perferationAngle/2;
        
        ctx.beginPath();
        
        for (let i = 0; i < 8; i++) {
            let angle1 = startAngle + perferationAngle * 2 * i;
            let arcCenter = angle1 + 1.5 * perferationAngle

            // radial arc
            ctx.arc( this.cx, this.cy, radius, angle1, angle1 + perferationAngle);
            // Concave dent
            ctx.arc( 
                this.cx+Math.cos(arcCenter) * perferationPosition,  
                this.cy+Math.sin(arcCenter) * perferationPosition, 
                perferationRadius, 
                Math.PI+arcCenter+smallTheta, 
                Math.PI + arcCenter - smallTheta, 
                true
            );
        }
        
        let x = this.cx + 15*Math.cos(theta-1.6 * Math.PI);
        let y = this.cy + 15*Math.sin(theta-1.6 * Math.PI);
        var grd=ctx.createRadialGradient(x, y, 0, x, y, radius);
        grd.addColorStop(1, "#202525");
        grd.addColorStop(0, "#101015");
        
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#605060";
        ctx.stroke();
    }
    
    drawBand(ctx: CanvasRenderingContext2D, theta: number ) {
        // InnerCircle
        let x = this.cx + 15*Math.cos(theta+1.1*Math.PI);
        let y = this.cy + 15*Math.sin(theta+1.1*Math.PI);
        
        var grd=ctx.createRadialGradient(x, y, 10, x, y, 40);
        grd.addColorStop(0, "#000000");
        grd.addColorStop(1, "#202020");
        
        ctx.beginPath();
        ctx.strokeStyle = grd;
        ctx.arc( this.cx, this.cy, this.r-20, 0, 2 * Math.PI, false);
        ctx.lineWidth = 10;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc( this.cx, this.cy, this.r-25, 0, 2 * Math.PI, false);
        ctx.strokeStyle = "#303030";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc( this.cx, this.cy, this.r-15, 0, 2 * Math.PI, false);
        ctx.strokeStyle = "#303030";
        ctx.lineWidth = 1;
        ctx.stroke();
        
//        ctx.beginPath();
//        ctx.fillStyle = "black";
//        ctx.strokeStyle = "black";
//        ctx.arc( this.cx, this.cy, this.r-24, 0, 2 * Math.PI, false);
//        ctx.fill();
//        ctx.stroke();
        
        // noise
//        ctx.beginPath();
//        ctx.fillStyle = "black";
//        ctx.fillRect(this.cx+Math.cos(pointyAngle) * (this.r-20), this.cy+Math.sin(pointyAngle) * (this.r-20),1,1);
//        ctx.fillRect(this.cx+Math.cos(pointyAngle+.6) * (this.r-22) -1, this.cy+Math.sin(pointyAngle+.6) * (this.r-22) -1,3,3);
//        ctx.fillRect(this.cx+Math.cos(pointyAngle+2) * (this.r-21)-1, this.cy+Math.sin(pointyAngle+2) * (this.r-21)-1,3,3);
//        ctx.stroke();
        

    }
}
