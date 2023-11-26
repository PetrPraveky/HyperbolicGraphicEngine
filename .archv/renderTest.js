import { Vector3D } from "../func/geometry/Vector.mjs";
import { CalculateLinePoints, CalculateLinePointsInSpace, Space } from "../func/hyperbolic_geometry/Space.mjs";


const c = document.getElementById("hyperbolicCanvas")
const ctx = c.getContext("2d");

const DEFAULT = "rgba(255, 255, 255, 0.25)"

const center = new Vector3D(c.width/2, c.height/2, 0);

// Prostor
let r = 10
const space = new Space(r);
let vector = new Vector3D(-1, 0, 0);
let mult = center.x/r;

ctx.strokeStyle = "white"
ctx.beginPath()
ctx.arc(center.x, center.y, center.x,0,2*Math.PI);
ctx.stroke()


// Nějakej listener
c.addEventListener("mousedown", function(e) {
    const rect = c.getBoundingClientRect();
    let x = e.clientX-rect.left;
    let y = e.clientY-rect.top;

    // Úplnej základ
    x = (x-center.x)/mult
    y = (center.y-y)/mult

    ctx.strokeStyle = "#"+Math.floor(Math.random()*16777215).toString(16)
    drawLine(new Vector3D(x, y, 0))
    ctx.strokeStyle = DEFAULT

})

// Základ xd
let vectorArrX = [
    new Vector3D(-1, 0, 0),
    new Vector3D(1, 0, 0),
]
let vectorArrY = [
    new Vector3D(0, -1, 0),
    new Vector3D(0, 1, 0),
]

ctx.strokeStyle = DEFAULT;





// Z
ctx.strokeStyle = "red"
ctx.beginPath();
ctx.moveTo(0, center.y);
ctx.lineTo(center.x*2, center.y)
ctx.stroke();

for (let m = 0.5; m < 10; m += 0.5) {
    vectorArrX.forEach((item) => {
        let vec = new Vector3D(item.x, item.y, item.z)
        vec.scale(m)
        vec = space.RecalculateVectorHyperDistance(vec)

        drawLine(vec)
    })
}

// Y
ctx.strokeStyle = "green"
ctx.beginPath();
ctx.moveTo(center.x, 0);
ctx.lineTo(center.x, center.y*2)
ctx.stroke();

for (let m = 0.5; m < 10; m += 0.5) {
    vectorArrY.forEach((item) => {
        let vec = new Vector3D(item.x, item.y, item.z)
        vec.scale(m)
        vec = space.RecalculateVectorHyperDistance(vec)

        drawLine(vec)
    })
}

let newVec = new Vector3D(2, -5, -4);


// ctx.strokeStyle = "pink"
// drawLineC(newVec)


let testVec = new Vector3D(1, -1, 0);
ctx.strokeStyle = "cyan"
drawLine(testVec)


//ctx.strokeStyle = "red";
function drawLine(vector) {
    
    let circlePoints = CalculateLinePoints(space, vector)
    
    let firstPoint = [
        circlePoints[0][0]*mult+center.x,
        center.y-circlePoints[0][1]*mult,
    ]
    
    ctx.beginPath();
    ctx.moveTo(firstPoint[0], firstPoint[1])
    for (let i = 1; i < circlePoints.length; i++) {
        let point = [
            circlePoints[i][0]*mult+center.x,
            center.y-circlePoints[i][1]*mult,
        ]
        //console.log(point)
        ctx.lineTo(point[0], point[1])
    }

    ctx.stroke()
}

// function drawLineC(vector) {
    
//     let circlePoints = CalculateLinePointsInSpace(space, vector, vector)
    
//     let firstPoint = [
//         circlePoints[0][0]*mult+center.x,
//         center.y-circlePoints[0][1]*mult,
//     ]
    
//     ctx.beginPath();
//     ctx.moveTo(firstPoint[0], firstPoint[1])
//     for (let i = 1; i < circlePoints.length; i++) {
//         let point = [
//             circlePoints[i][0]*mult+center.x,
//             center.y-circlePoints[i][1]*mult,
//         ]
//         //console.log(point)
//         ctx.lineTo(point[0], point[1])
//     }

//     ctx.stroke()
// }