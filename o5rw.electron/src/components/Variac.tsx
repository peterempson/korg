import * as React from "react";
import { Motivator } from "./Motivator";
import { Nixie } from "./Nixie";

export interface VariacProps { updated: Function };
export interface VariacState {temperature: number};
export class Variac extends React.Component<VariacProps, VariacState> {
    canvas: HTMLCanvasElement;
    cx = 100;
    cy = 75;
    r = 30;
    
    motivator: Motivator;

    minTheta = 0.85 * Math.PI;
    midpointTheta = .5 * Math.PI;
    maxTheta = 0.15 * Math.PI;
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
            <canvas className="bob" onMouseMove={this.mouseMove} ref={x => this.canvas = x}>Your browser does not support the HTML5 canvas tag.</canvas>
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
        const context = this.canvas.getContext( "2d" );

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.strokeStyle = '#ffE000';

        context.beginPath();
        context.arc( 100, 75, 60, 0.85 * Math.PI, 0.15 * Math.PI );

        context.moveTo( this.cx, this.cy )
        this.drawLine( context, this.state.temperature)
        context.shadowBlur = 5;
        context.shadowColor = "rgb(255,0,0)";
        context.shadowBlur = 20;
        context.lineWidth = 3;
        context.stroke();
        context.stroke();
    }

    drawLine( context: CanvasRenderingContext2D, value: number ) {
        const theta = value / this.maxTemperature * this.arcLength + this.minTheta
        const q = this.cx + this.r * Math.cos( theta ),
            w = this.cy + this.r * Math.sin( theta )
        context.moveTo( q, w )
        const e = q + this.r * Math.cos( theta ),
            t = w + this.r * Math.sin( theta )
        context.lineTo( e, t )
    }

}
