class Boid {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
    }

    distance(b) {
        let dx = this.x - b.x;
        let dy = this.y - b.y;
        return Math.sqrt(dx*dx+dy*dy);
    }
}

const boids = [
    new Boid(10,10)
];

document.addEventListener("DOMContentLoaded", function (ev) {
    setInterval(update_boids, 1000);
});

function update_boids() {
    canvas = document.getElementById("boidbox");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 1200, 600);
    for (let b of boids) {
        console.log(b.x + "," + b.y + " " + b.vx + "," + b.vy);
        for (let n of boids) {
            if(b == n) continue;
            if(b.distance(n) > 10) continue;
            b.vx += b.x - n.x;
            b.vy += b.y - n.y;
        }
    }

    for (let b of boids) {
        b.x += b.vx;
        b.y += b.vy;
        ctx.fillRect(b.x, b.y, 20, 20);
    }
}