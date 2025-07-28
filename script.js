class Boid {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
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
        // physics here

        ctx.fillRect(b.x, b.y, 20, 20);
    }
}