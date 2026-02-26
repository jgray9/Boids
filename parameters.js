const FPS = 30;                 // updates per second
const BPS = 10;                 // number of boids spawned per second when mouse is down
const BSIZE = 5;                // size of boids
const LSIZE = 0.5;              // size of neighbor lines
const COLLISION_RADIUS = 20;    // max distance between boids for collision avoidance
const NEIGHBOR_RADIUS = 100;    // max distance between boids for velocity matching and centering

const COLLISION_FORCE = 0.05;   // modifier for collision avoidance force
const VELOCITY_FORCE = 0.05;    // modifier for velocity matching force
const CENTERING_FORCE = 0.001;  // modifier for flock centering force
const BORDER_FORCE = 0.02;      // modifier for border avoidance force

LVISIBLE = false;               // when true, draw lines between boids within neighbor radius

const MAX_SPEED = 10;           // maximum speed for any boid
const MIN_SPEED = 2;            // minimum speed for any boid