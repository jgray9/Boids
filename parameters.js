const dt = 0.05;    // timestep in seconds
const BSIZE = 5;                // size of boids
const LSIZE = 0.5;              // size of neighbor lines
const NEIGHBOR_RADIUS = 40;     // distance 
const STEERING_RADIUS = 40;     

const COLLISION_FORCE = 1;      // modifier for collision avoidance force
const VELOCITY_FORCE = 1;       // modifier for velocity matching force
const CENTERING_FORCE = 1;      // modifier for flock centering force
const BORDER_FORCE = 10;        // modifier for border avoidance force

LVISIBLE = false;

const MIN_SPEED = 40;   // minimum speed for any boid