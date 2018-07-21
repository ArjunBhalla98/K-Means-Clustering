class Cluster {
    constructor(position, xPoints, colour) {
        this.position = position;
        this.xPoints = xPoints;
        this.colour = colour;
        this.pastLocations = [position];
    }
}