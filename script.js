var clusters = [];
var xPoints = [];
var kPoints = [];
const circleSize = 8;
const colour_list = ["red","blue","yellow","green","pink","purple","orange","teal","brown","white"];

function pullNumbers() {
    var x = document.getElementById("xField").value;
    var k = document.getElementById("kField").value;
    return [x, k]
}

function clearCanvas(){
    var canvas = document.getElementById("canvas");
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
}

function generateRandomPoints(x, k) {
    
    
    const minX = circleSize*2*Math.PI;
    const minY = circleSize*2*Math.PI;
    const maxX = 800 - 80;
    const maxY = 600 - 60;

    
    for(let i = 0; i < x; i++){
        let xCord = Math.floor(Math.random()*maxX + minX);
        let yCord = Math.floor(Math.random()*maxY + minY);
        xPoints[i] = [xCord, yCord];
    }

    
    for(let i = 0; i < k; i++){
        let xCord = Math.floor(Math.random()*maxX + minX);
        let yCord = Math.floor(Math.random()*maxY + minY);
        kPoints[i] = [xCord, yCord];
    }
    
}

function draw(){
    // Expects 2 arrays
    const canvas = document.getElementById("canvas");
    let context = document.querySelector("canvas").getContext("2d");

    for(let i = 0; i < kPoints.length; i++){
        let clust = clusters[i];

        // Draw cluster triangle
        context.fillStyle = clust.colour;
        context.beginPath();
        let currX = clusters[i].position[0];
        let currY = clusters[i].position[1];
        context.moveTo(currX, currY);
        context.lineTo(currX + 25, currY);
        context.lineTo(currX + 12.5, currY - 25);
        context.fill();

        // Draw the x values for that cluster
        for(let j = 0; j < clust.xPoints.length; j++){
            context.fillStyle = clust.colour;
            context.beginPath();
            context.arc(clust.xPoints[j][0], clust.xPoints[j][1], circleSize, 0, 2*Math.PI);
            context.fill();
        }

    }

}

function assignClusters() {
    for(let i = 0; i < kPoints.length; i++){
        clusters.push(new Cluster(kPoints[i],[],colour_list[i])); 
    }
}

function calculateDistance(point1, point2){
    // Two arrays w/ an x and a y coordinate each
    return Math.sqrt(Math.pow((point1[0] - point2[0]), 2) + Math.pow(point1[1] - point2[1],2));

}

function matchXtoK(){
    for(let i = 0; i < xPoints.length; i++){
        var closest_cluster = clusters[0];
        var cluster_min_dist = 999999;

        for(let j = 0; j < clusters.length; j++){
            let dist = calculateDistance(xPoints[i], clusters[j].position);
            if(dist < cluster_min_dist){
                cluster_min_dist = dist;
                closest_cluster = clusters[j];
            }
        }
        closest_cluster.xPoints.push(xPoints[i]);
    }
}

function generate(){
    var values = pullNumbers();

    // Clear Canvas, reset variables
    clearCanvas();
    clusters = [];
    kPoints = [];
    xPoints = [];

    generateRandomPoints(values[0], values[1]);

    // // Initialise clusters
    assignClusters();

    matchXtoK();

    // Draw initial clusters and points
    draw();
}

function averageLocation(arr) {
    var xSum = 0;
    var ySum = 0;

    for(let i = 0; i < arr.length; i++){
        xSum += arr[i][0];
        ySum += arr[i][1];
    }

    return [xSum/arr.length, ySum/arr.length];
}

function recalculatePositions(){
    
    for(let i = 0; i < clusters.length; i++){
        var clus = clusters[i];

        if(clus.xPoints.length != 0){
            console.log(clus.xPoints);
            clus.position = averageLocation(clus.xPoints);
            clus.xPoints = [];
        }
    }
}

function step(){
    clearCanvas();

    // Recalculate positions of clusters
    recalculatePositions();

    // Re-match stuff and update
    
    matchXtoK();
    draw();

    


}