class Boid {
    constructor(x,y) {
        this.pos = new Vector(x,y);
        this.vel = new Vector();
    }

    static Distance(b,b2) {
        return Math.sqrt( b.pos.sub(b2.pos).length2 );
    }
}

class KDTree {
    root = null;

    insert(b) {
        if (this.root == null) {
            this.root = {
                boid: b,
                left: null,
                right: null
            };
        } else
            this.insertR(b, this.root, true);
    }

    insertR(b, node, is_x) {
        let bc = is_x ? b.pos.x : b.pos.y;
        let nc = is_x ? node.boid.pos.x : node.boid.pos.y;
        let new_node = {
            boid: b,
            left: null,
            right: null
        };

        if (bc < nc) {
            if (node.left == null)
                node.left = new_node;
            else
                this.insertR(b, node.left, !is_x);
        } else {
            if (node.right == null)
                node.right = new_node;
            else
                this.insertR(b, node.right, !is_x);
        }
    }

    findNeighbors(b, radius) {
        let neighbors = [];
        let rec = this.findNeighborsR(b, this.root, radius, true);
        for (let iter = rec.next(); !iter.done; iter = rec.next())
            neighbors.push(iter.value.boid);
        return neighbors;
    }

    * findNeighborsR(b, node, radius, is_x) {
        if (node == null) return;
        let bc = is_x ? b.pos.x : b.pos.y;
        let nc = is_x ? node.boid.pos.x : node.boid.pos.y;
        if (b != node.boid && Boid.Distance(b, node.boid) < radius)
            yield node;
        if (nc >= bc - radius)
            yield* this.findNeighborsR(b, node.left,  radius, !is_x);
        if (nc <= bc + radius)
            yield* this.findNeighborsR(b, node.right, radius, !is_x);
    }
}

class Vector {
    constructor(x=0,y=x) {
        this.x = x;
        this.y = y;
    }

    get length2() {
        return this.x ** 2 + this.y ** 2;
    }

    setLength(i) {
        this.idiv(Math.sqrt(this.length2));
        this.imul(i);
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