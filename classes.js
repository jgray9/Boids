class Boid {
    constructor(x,y) {
        this.p = new Vector(x,y);
        this.v = new Vector();
    }
}

class KDTree {
    root = null;

    insert(b) {

    }

    insertr(b, node, is_x) {

    }

    search(b) {

    }

    searchr(b, node, is_x) {

    }
}

class Vector {
    constructor(x=0,y=x) {
        this.x = x;
        this.y = y;
    }

    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    set length(i) {
        this.idiv(this.length);
        this.imul(i);
    }

    distance(otherVec) {
        return this.sub(otherVec).length;
    }

    add(otherVec) {
        return new Vector(
            this.x + (otherVec.x ?? otherVec),
            this.y + (otherVec.y ?? otherVec)
        );
    }

    sub(otherVec) {
        return new Vector(
            this.x - (otherVec.x ?? otherVec),
            this.y - (otherVec.y ?? otherVec)
        );
    }

    mul(otherVec) {
        return new Vector(
            this.x * (otherVec.x ?? otherVec),
            this.y * (otherVec.y ?? otherVec)
        );
    }

    div(otherVec) {
        return new Vector(
            this.x / (otherVec.x ?? otherVec),
            this.y / (otherVec.y ?? otherVec)
        );
    }

    iadd(otherVec) {
        this.x += otherVec.x ?? otherVec;
        this.y += otherVec.y ?? otherVec;
    }

    imul(otherVec) {
        this.x *= otherVec.x ?? otherVec;
        this.y *= otherVec.y ?? otherVec;
    }

    idiv(otherVec) {
        this.x /= otherVec.x ?? otherVec;
        this.y /= otherVec.y ?? otherVec;
    }
}