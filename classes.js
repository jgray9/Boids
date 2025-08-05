class Boid {
    constructor(x,y) {
        this.p = new Vector(x,y);
        this.v = new Vector();
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
            this.insertr(b, this.root, true);
    }

    insertr(b, node, is_x) {
        let bc = is_x ? b.p.x : b.p.y;
        let nc = is_x ? node.boid.p.x : node.boid.p.y;
        let new_node = {
            boid: b,
            left: null,
            right: null
        };

        if (bc < nc) {
            if (node.left == null)
                node.left = new_node;
            else
                this.insertr(b, node.left, !is_x);
        } else {
            if (node.right == null)
                node.right = new_node;
            else
                this.insertr(b, node.right, !is_x);
        }
    }

    search(b, radius) {
        let neighbors = [];
        let rec = this.searchr(b, this.root, radius, true);
        for (let iter = rec.next(); !iter.done; iter = rec.next())
            neighbors.push(iter.value.boid);
        return neighbors;
    }

    * searchr(b, node, radius, is_x) {
        if (node == null) return;
        let bc = is_x ? b.p.x : b.p.y;
        let nc = is_x ? node.boid.p.x : node.boid.p.y;
        if (b != node.boid && b.p.distance(node.boid.p) < radius)
            yield node;
        if (nc >= bc - radius)
            yield* this.searchr(b, node.left,  radius, !is_x);
        if (nc <= bc + radius)
            yield* this.searchr(b, node.right, radius, !is_x);
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