export default class Vector {
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }

    static DistanceSquared(v, w) {
        return v.sub(w).getLengthSquared();
    }

    static Distance(v, w) {
        return v.sub(w).getLength();
    }

    getLengthSquared() {
        return this.x ** 2 + this.y ** 2;
    }

    getLength() {
        return Math.sqrt(this.getLengthSquared());
    }

    // return a vector in the same direction with a different length
    withLength(i) {
        return this.div(this.getLength()).mul(i);
    }

    add(v) {
        if (typeof v === 'number')
            return new Vector(this.x + v, this.y + v);
        return new Vector(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        if (typeof v === 'number')
            return new Vector(this.x - v, this.y - v);
        return new Vector(this.x - v.x, this.y - v.y);
    }
    
    mul(v) {
        if (typeof v === 'number')
            return new Vector(this.x * v, this.y * v);
        return new Vector(this.x * v.x, this.y * v.y);
    }
    
    div(v) {
        if (typeof v === 'number') {
            if(v === 0)
                throw new Error('divide by zero');
            return new Vector(this.x / v, this.y / v);
        }

        if(v.x === 0 || v.y === 0)
            throw new Error('divide by zero');
        return new Vector(this.x / v.x, this.y / v.y);
    }
}