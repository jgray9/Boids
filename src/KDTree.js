import Vector from "./Vector";

export default class KDTree {
    root = null;

    constructor(r) {
        this.r = r;
    }

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
        let bc = is_x ? b.p.x : b.p.y;
        let nc = is_x ? node.boid.p.x : node.bo.pos.y;
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

    findNeighbors(b) {
        let neighbors = [];
        let rec = this.findNeighborsR(b, this.root, true);
        for (let iter = rec.next(); !iter.done; iter = rec.next())
            neighbors.push(iter.value.boid);
        return neighbors;
    }

    * findNeighborsR(b, node, is_x) {
        if (node == null) return;
        let bc = is_x ? b.p.x : b.p.y;
        let nc = is_x ? node.boid.p.x : node.boid.p.y;
        if (b != node.boid && Vector.Distance(b.p, node.boid.p) < this.r)
            yield node;
        if (nc >= bc - this.r)
            yield* this.findNeighborsR(b, node.left,  !is_x);
        if (nc <= bc + this.r)
            yield* this.findNeighborsR(b, node.right, !is_x);
    }
}