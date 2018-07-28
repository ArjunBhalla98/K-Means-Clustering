var clusters = [];
var xPoints = [];
var kPoints = [];
var epsilon = 0;
var count = 0;
var isOver = false;
const circleSize = 8;
var update_cents = true;
const colour_list = ["red","blue","yellow","green","pink","purple","orange","teal","brown","white"];

function pullNumbers() {
    var x = document.getElementById("xField").value;
    var k = document.getElementById("kField").value;
    var e = document.getElementById("eField").value;
    return [x, k, e]
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
    
    const canvas = document.getElementById("canvas");
    let context = document.querySelector("canvas").getContext("2d");

    for(let i = 0; i < kPoints.length; i++){
        let clust = clusters[i];

        // Draw cluster triangle
        context.fillStyle = clust.colour;
        context.strokeStyle = "black";
        context.beginPath();
        let currX = clusters[i].position[0] - 12.5;
        let currY = clusters[i].position[1] + 12.5;
        context.moveTo(currX, currY);
        context.lineTo(currX + 25, currY);
        context.stroke();
        context.lineTo(currX + 12.5, currY - 25);
        context.stroke();
        context.lineTo(currX, currY);
        context.stroke();
        context.fill();

        // Draw the x values for that cluster
        for(let j = 0; j < clust.xPoints.length; j++){
            context.fillStyle = clust.colour;
            context.beginPath();
            context.arc(clust.xPoints[j][0], clust.xPoints[j][1], circleSize, 0, 2*Math.PI);
            context.fill();
        }

    }
    drawPath();
}


function drawPath(){
    let context = document.querySelector("canvas").getContext("2d");

    for(let i = 0; i < clusters.length; i++){
        clust = clusters[i];

        context.strokeStyle = clust.colour;
        context.beginPath();
        context.moveTo(clust.pastLocations[0][0], clust.pastLocations[0][1]);

        for(let j = 1; j < clust.pastLocations.length; j++){
            context.lineTo(clust.pastLocations[j][0], clust.pastLocations[j][1]);
            context.stroke();
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
    for(let k = 0; k < clusters.length; k++){
        clusters[k].xPoints = [];
    }

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
    var countHeader = document.getElementById("stepsUsed");
    countHeader.innerText = "Steps Used: 0";
    var lastAc = document.getElementById("lastAction");
    lastAc.innerText = "Last Action: Generate Clusters"
    clusters = [];
    kPoints = [];
    xPoints = [];
    count = 0;
    epsilon = values[2];
    isOver = false;
    update_cents = true;

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

function checkIsOver() {
    var localCheck = true;

    for(let i = 0; i < clusters.length; i++){
        let lenPastLocs = clusters[i].pastLocations.length - 1;
            let dist = calculateDistance(clusters[i].pastLocations[lenPastLocs], clusters[i].pastLocations[lenPastLocs - 1]);
            if(dist > epsilon) {
                localCheck = false;
            }
    }
    if(localCheck){
        isOver = true;
    }
}

function recalculatePositions(){
    
    for(let i = 0; i < clusters.length; i++){
        var clus = clusters[i];

        if(clus.xPoints.length != 0){
            clus.position = averageLocation(clus.xPoints);
        }
        clus.pastLocations.push(clus.position);
    }
}

function updateCount(){
    if(!isOver){
        count += 1;
        var countHeader = document.getElementById("stepsUsed");
        countHeader.innerText = "Steps Used: " + count;
    }
    
}

function step(){
    clearCanvas();
    if(update_cents){
        update_cents = false;
        updateCentroids();
        
    } else { // Reassign points
        update_cents = true;
        reassignPoints();
        
    }
    if(!isOver){
        updateLastAction();
    }
    
}

function updateCentroids(){
    
    recalculatePositions();
    draw();
    updateCount();
    checkIsOver();
}

function reassignPoints(){
    
    matchXtoK();
    draw();
    checkIsOver();
       
}

function updateLastAction(){
    if(!isOver){
        var el = document.getElementById("lastAction");
        el.innerText = update_cents ? "Last Action: Reassign points" : "Last Action: Update Centroids";
    }
    
}

function animate_method(){
    step();
    if(!isOver){
        animate_method();   
    }
}