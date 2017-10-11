export interface MotivatorProps { id: number, callback: Function; maxValue: number, maxSpeed: number, acceleration: number};

//
// Handles animation position with acceleration / deceleration
// -----------------------------------------------------------
export class Motivator {
    props: MotivatorProps;
    targetValue = 0;
    displayValue = 0;
    speed = 0;
    lastAnimationTime: number;
    animationRequest: number
    
    constructor( props: MotivatorProps ) {
        this.props = props;
    }
    
    //
    // Set the target value
    // ----------------------------
    setValue(value: number) {
        this.targetValue = value;
        if (!this.animationRequest) {
            this.animationRequest = requestAnimationFrame(this._tick);
        }
    }
    
    //
    // Get the current target value
    // ----------------------------
    getValue() {
        return this.targetValue;
    }
    
    // 
    // Stop the animationRequest cycle. Call on componentDidUnmount
    // ------------------------------------------------------------
    stop() {
        if (this.animationRequest) {
            cancelAnimationFrame(this.animationRequest);
        }
    }
    
    //
    // Main animate frame call
    // -----------------------
    _tick = () => {
        var now = performance.now();
        if (this.lastAnimationTime && this.targetValue !== this.displayValue) {
            var timePassed = now - this.lastAnimationTime
            var distanceToCover = this.targetValue - this.displayValue;

            this._updateSpeed(timePassed, distanceToCover);
            var step = this._calculateStep(timePassed, distanceToCover);
            if (step) {
                this._updateDisplayValue(step)
            }
        }
        
        if (this.lastAnimationTime && !this.speed ) {
            // Have reached the target so stop animationFrame cycle
            this.animationRequest = null;
        } else {
            
            this.animationRequest = requestAnimationFrame(this._tick);
        }
        this.lastAnimationTime = now;
    }
    
    // 
    // Calculate the current speed based on direction and proximity to target / ends
    // -----------------------------------------------------------------------------
    _updateSpeed(timePassed: number, distanceToCover: number){
        // Is the deceleration rate needed to stop in time higher than our deceleration?
        var shouldSlowDown = Math.pow(this.speed, 2)/(2*Math.abs(distanceToCover)) >= this.props.acceleration;
        var goingUpward = distanceToCover > 0;
        var speedDelta = timePassed * this.props.acceleration;
        var unlimitedSpeed: number;
        if (goingUpward && !shouldSlowDown || !goingUpward && shouldSlowDown) {
          unlimitedSpeed = this.speed + speedDelta
        } else {
            unlimitedSpeed = this.speed - speedDelta
        }
        this.speed = this._limitValue(unlimitedSpeed, this.props.maxSpeed);
    }
    
    //
    // Calculate the new display value and hit the callback
    // ----------------------------------------------------
    _updateDisplayValue(delta: number) {
        this.displayValue = this._limitValue(this.displayValue + delta, this.props.maxValue, 0);
        this.props.callback(this.props.id, this.displayValue);
        if (this.displayValue <= 0 || this.displayValue >= this.props.maxValue || this.displayValue === this.targetValue) {
            this.speed = 0;
        }
    }

    // 
    // Calculate the amount to move the animation based on current speed
    // -----------------------------------------------------------------
    _calculateStep(timePassed: number, distanceToCover: number) {        
        var step = this.speed * timePassed;
        var approachingTarget = this._sameSigned(distanceToCover, this.speed);
        if (!approachingTarget) {
            // Still decelerating away from the target
            return step;
        } 
        return this._limitValue(step, distanceToCover);
    }

    //
    // Both positive or both negative
    // ------------------------------
    _sameSigned(a: number, b: number) {
        return (a > 0 && b > 0) || (a < 0 && b < 0);
    }
    
    //
    // Return  value limited to max and optionally min, retaining value's sign
    // -----------------------------------------------------------------------
    _limitValue(value: number, max: number, min?: number) {
        var belowMax = Math.min(Math.abs(value), Math.abs(max));
        var result = min ? Math.max(belowMax, Math.abs(min)): belowMax;
        return value < 0 ? -result : result;
    }
    
}