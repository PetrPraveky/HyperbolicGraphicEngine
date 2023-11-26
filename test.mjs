/*
import { Vector3D } from "./func/geometry/Vector.mjs";
import { CalculateLinePoints, Space } from "./func/hyperbolic_geometry/Space.mjs";


let d = new Vector3D(-3, -4, 0)
console.log(d.toString())
console.log(d.getMagnitude())

let space = new Space(10)

let circlePoints = CalculateLinePoints(space, d)

console.log(circlePoints[0])
console.log(circlePoints[circlePoints.length-1])

d.normalize()
console.log(d);
*/
/*
// Error do 10% 
function approx(x) {
    return 1.1221*Math.pow(x, 1.0869)
}

console.log("2nd power:")
const ans = []
for (let x = 0.5; x < 7.5; x += 0.5) {
    ans.push(
        [
            x, 
            //0.0043*(x*x)+1.3405*x-0.2615, 
            // 0.00002*Math.pow(x, 4)-0.0048*Math.pow(x, 3)+0.0518*Math.pow(x, 2)+1.1675*x-0.1011, 
            // 5e-06*Math.pow(x, 6)-0.00002*Math.pow(x, 5)+0.0036*Math.pow(x, 4)-0.0318*Math.pow(x, 3)+0.1565*Math.pow(x, 2)+0.9944*x-0.0178,
            // 5e-08*Math.pow(x, 6)-5e-06*Math.pow(x, 5)+0.00002*Math.pow(x, 4)+0.0039*Math.pow(x, 3)+0.0398*Math.pow(x, 2)+1.2083*x-0.1325,
            // 10% error do limity (7.46135)
            // 1.1575*Math.pow(x, 1.0616),
            approx(x),
        ],
    )
    //console.log(String(x)+"\t\t"+String(0.0043*(x*x)+1.3405*x-0.2615)+"\t\t"+String(0.00002*Math.pow(x, 4)-0.0048*Math.pow(x, 3)+0.0518*Math.pow(x, 2)+1.1675*x-0.1011))
}
ans.push([
    7.46135,
    approx(7.46135),
])
console.table(ans)
*/

// import { Matrix3x3 } from "./func/geometry/Matrix.mjs";
// import { GEM, Vector3D } from "./func/geometry/Vector.mjs";

// import { ProjectVectorToXY, Vector3D } from "./func/geometry/Vector.mjs";
// import { CalculateLinePointsInSpace, Space } from "./func/hyperbolic_geometry/Space.mjs";

// let vec = new Vector3D(4, 5, 2)
// let out1 = [vec.toString(), vec.getMagnitude()]

// let projVec = ProjectVectorToXY(vec)
// let out2 = [projVec.toString(), projVec.getMagnitude()]

// let angle = projVec.getAngle(vec)

// console.table([out1, out2, angle])

// let space = new Space(10);

// console.log(CalculateLinePointsInSpace(space, vec))

//     [2, -1, 1],
//     [-3, -1, 2],
//     [-2, 1, 2]
// let mat = new Matrix3x3(
//     new Vector3D(0, 0, 1),
//     new Vector3D(1, 0, 0),
//     new Vector3D(0, 1, 0)
// )

// GEM(mat, vec)

// console.log(mat)
// console.log(mat.getInverse())

// console.log((-0)*(-2))




// function gaussianElimination(A, B) {
//     const n = A.length;

//     // Augmenting the matrix A with vector B
//     for (let i = 0; i < n; i++) {
//         A[i].push(B[i]);
//     }

//     for (let i = 0; i < n; i++) {
//         // Making the diagonal element 1
//         let divisor = A[i][i];
//         for (let j = i; j < n + 1; j++) {
//             A[i][j] /= divisor;
//         }

//         // Making the other rows 0
//         for (let k = 0; k < n; k++) {
//             if (k !== i) {
//                 let factor = A[k][i];
//                 for (let j = i; j < n + 1; j++) {
//                     A[k][j] -= factor * A[i][j];
//                 }
//             }
//         }
//     }

//     // Extracting the solution
//     const solution = [];
//     for (let i = 0; i < n; i++) {
//         solution.push(A[i][n]);
//     }

//     return solution;
// }

// // Example usage
// const coefficients = [
//     [2, -1, 1],
//     [-3, -1, 2],
//     [-2, 1, 2]
// ];

// const constants = [8, -11, -3];

// const solution = gaussianElimination(coefficients, constants);
// console.log(solution);

