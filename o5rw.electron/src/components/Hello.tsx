import * as React from "react";

export interface HelloProps { compiler: string; framework: string};
export interface HelloState {temperature: number};
export class Hello extends React.Component<HelloProps, HelloState> {
    canvas: HTMLCanvasElement;
    targetTemperature = 0;
    cx = 100;
    cy = 75;
    r = 30;
    lastAnimation: number;
    
    

    minTheta = 0.85 * Math.PI;
    midpointTheta = .5 * Math.PI;
    maxTheta = 0.15 * Math.PI;
    arcLength = 2 * Math.PI - ( this.minTheta - this.maxTheta )
    
    maxTemperature = 127;
    
    speed = 0;
    maxSpeed = .5;
    acceleration = 0.0012;
    
    constructor( props: HelloProps ) {
        super( props );
        this.state = {
            temperature: 0
        };
    }
    
    render() {
        return (
            <canvas onMouseMove={this.doTheMouse} ref={x => this.canvas = x}>Your browser does not support the HTML5 canvas tag.</canvas>
        );
    }
    doTheMouse = ( e: React.MouseEvent ) => {

        var theta = Math.PI + Math.atan2( this.cy - e.clientY, this.cx - e.clientX ); // 0 East, .5 Pi South
        if (theta > this.midpointTheta && theta < this.minTheta) {
            theta = this.minTheta
        } else if (theta <= this.midpointTheta && theta > this.maxTheta) {
            theta = this.maxTheta
        }
        var m = theta - this.minTheta 
        if (m < 0) {
            m += 2 * Math.PI;
        }
        
        
        this.targetTemperature = Math.floor(this.maxTemperature * m / this.arcLength);
    }
    

    
    calculateDelta(timePassed: number, target: number) {
        if (target === this.state.temperature) {
            return 0;
        } 
        var delta = target - this.state.temperature;
        var speedDelta = timePassed * this.acceleration;
        var slowDown = Math.pow(this.speed, 2)/(2*Math.abs(delta)) >= this.acceleration;
        var headingToward = this._sameSigned(delta, this.speed);
        var increasing = target > this.state.temperature;
        var z;
        if (increasing && !slowDown || !increasing && slowDown) {
           z = 1;
        } else {
            z = -1;
        }
        this.speed = this._getLimited(this.speed + z * speedDelta, this.maxSpeed);
        var step = this.speed * timePassed;
        
        if (!headingToward) {
            // Still decelerating away from the target
            return step;
        } 
        return this._getLimited(step, delta);
    }
    
    tick = () => {
        var now = performance.now();
        if (this.lastAnimation) {
            var delta = this.calculateDelta(now - this.lastAnimation, this.targetTemperature);
            if (delta) {
                var temp = this._restrict(this.state.temperature + delta, 0, this.maxTemperature);
                this.setState({temperature: temp });
                if (temp === 0 || temp === this.maxTemperature || temp === this.targetTemperature) {
                    this.speed = 0;
                }
            }
        }
        this.lastAnimation = now;
        requestAnimationFrame(this.tick);
    }
    
    componentDidUpdate() {
        this.draw();
    }
    componentDidMount() {
        requestAnimationFrame(this.tick)
        this.draw();
    }
    draw() {
        const context = this.canvas.getContext( "2d" );

        const gradient = context.createLinearGradient( 0, 0, 150, 300 );
        gradient.addColorStop( 0, '#100' )
        gradient.addColorStop( 1, '#000' )
        context.fillStyle = gradient
        context.fillRect( 0, 0, 300, 300 )

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
    
    _sameSigned(a: number, b: number) {
        return (a > 0 && b > 0) || (a < 0 && b < 0);
    }
    
    _getLimited(a: number, b: number) {
        var a_=Math.abs(a);
        var b_ = Math.abs(b);
        if (a_ < b_) {
            return a;
        } else if (a < 0) {
            return -b_;
        } 
        return b_;
    }
    
    _restrict(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }
}
