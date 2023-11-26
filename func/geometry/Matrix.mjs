import { Vector3D, Vector3DFromArray } from "./Vector.mjs";

export class Matrix3x3 {
    /**
     * 
     * @param {Vector3D} a 
     * @param {Vector3D} b 
     * @param {Vector3D} c 
     */
    constructor(a, b, c) {
        let a1 = a.toArray();
        let b1 = b.toArray();
        let c1 = c.toArray();

        this.matrix = [a1, b1, c1]
    }

    getMatrix() {
        return this.matrix
    } 
    /**
     * Použito:
     * https://en.wikipedia.org/wiki/Invertible_matrix#Inversion_of_3_%C3%97_3_matrices
     */
    getInverse() {
        let mat = this.matrix
        
        // Každý člen matice zvlášť
        let a = mat[0][0]
        let b = mat[1][0]
        let c = mat[2][0]

        let d = mat[0][1]
        let e = mat[1][1]
        let f = mat[2][1]

        let g = mat[0][2]
        let h = mat[1][2]
        let i = mat[2][2]

        // Nějaký kraviny
        let A =  (e*i - f*h)
        let B = -(d*i - f*g)
        let C =  (d*h - e*g)
        
        let D = -(b*i - c*h)
        let E =  (a*i - c*g)
        let F = -(a*h - b*g)

        let G =  (b*g - c*e)
        let H = -(a*f - c*d)
        let I =  (a*e - b*d)

        // Determinant
        let detA = a*A+b*B+c*C

        // Nová matice
        let vec1 = new Vector3D(
            A/detA,
            B/detA,
            C/detA
        )
        let vec2 = new Vector3D(
            D/detA,
            E/detA,
            F/detA
        )
        let vec3 = new Vector3D(
            G/detA,
            H/detA,
            I/detA
        )
        let newMat = new Matrix3x3(vec1, vec2, vec3)

        return newMat
    }

    transpose() {
        let a = this.matrix[0]
        let b = this.matrix[1]
        let c = this.matrix[2]

        let nA = [a[0], b[0], c[0]]
        let nB = [a[1], b[1], c[1]]
        let nC = [a[2], b[2], c[2]]

        this.matrix = [nA, nB, nC]
    }

    copy() {
        new Matrix3x3(
            Vector3DFromArray(this.matrix[0]),
            Vector3DFromArray(this.matrix[1]),
            Vector3DFromArray(this.matrix[2])
        )
    }
}