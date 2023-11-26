import { Matrix3x3 } from "./Matrix.mjs";

export class Vector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toString() {
        return "("+String(this.x)+", "+String(this.y)+", "+String(this.z)+")";
    }

    toArray() {
        return [this.x, this.y, this.z]
    }

    getMagnitude() {
        return Math.sqrt(Math.pow(this.x, 2)+Math.pow(this.y, 2)+Math.pow(this.z, 2))
    }

    normalize() {
        let mag = this.getMagnitude();
        this.x = this.x/mag
        this.y = this.y/mag
        this.z = this.z/mag
    }

    scale(scalar) {
        this.x = this.x*scalar
        this.y = this.y*scalar
        this.z = this.z*scalar
    }

    copy() {
        return new Vector3D(this.x, this.y, this.z)
    }

    dotProduct(b) {
        let a = this.copy()
        return a.x*b.x+a.y*b.y+a.z*b.z
    }

    getAngle(b) {
        let a = this.copy()
        a.normalize()
        b.normalize()
        return Math.acos(a.dotProduct(b))
    }

    crossProduct(b) {
        let a = this.copy()

        return new Vector3D(
            a.y*b.z - a.z*b.y,
            a.z*b.x - a.x*b.z,
            a.x*b.y - a.y*b.x
        )
    }

    add(b) {
        let a = this.copy()

        return new Vector3D(
            a.x + b.x,
            a.y + b.y,
            a.z + b.z
        )
    }

    multiplyByMatrix(m) {
        let mat = m.matrix;
        
        let newX = this.x*mat[0][0]+this.y*mat[1][0]+this.z*mat[2][0]
        let newY = this.x*mat[0][1]+this.y*mat[1][1]+this.z*mat[2][1]
        let newZ = this.x*mat[0][2]+this.y*mat[1][2]+this.z*mat[2][2]

        return new Vector3D(newX, newY, newZ)
    }

    isZero() {
        if (this.x == 0 && this.y == 0 && this.z == 0) {
            return true
        }
        return false
    }
}

export function Vector3DFromArray(a) {
    return new Vector3D(a[0], a[1], a[2])
}



/**
 * Vrátí vektor skáláru lineární kombinace vektorů báze, která dává vstupní vektor
 * Vypočítá skaláry GAUSOVOU ELIMINAČNÍ METODOU
 * @param {Vector3D} vec 
 * @param {Array<Vector3D>} base 
 */
export function GetCoordOnBase(vec, base) {



}
// DODĚLAT
/**
 * @param {Matrix3x3} A 
 * @param {Vector3D} b 
 */
export function GEM(A, B) {
    let aTemp = A.getMatrix()
    let b = B.toArray()
    let a = convertMatrixToGEMForm(aTemp, b)

    let isNotOkej = true;

    // Kontrola hlavní diagonály -> pokud je někde 0, problém
    /*
    while (isNotOkej) {
        if (
            a[0][0] == 0 ||
            a[1][1] == 0 ||
            a[1][1] == 0
        ) {
            isNotOkej = true;
            let temp = a[0].slice()
            a[0] = a[1].slice()
            a[1] = a[2].slice()
            a[2] = temp
        } else {isNotOkej = false}
    }
    */

    // Gausovka? Asi :D
    for (let i = 1; i < 3; i++) {
        let div = a[i-1][i-1]
        for (let j = 0; i+j < 3; j++) {
            let sub = a[i+j][i-1]/div
            a[i+j] = [
                a[i+j][0]-(sub*a[i-1][0]),
                a[i+j][1]-(sub*a[i-1][1]),
                a[i+j][2]-(sub*a[i-1][2]),
                a[i+j][3]-(sub*a[i-1][3])
            ]
        }
    }
    // Výsledek
    let solution = []
    for (let i = 0; i < a.length; i++) {

    }



    function convertMatrixToGEMForm(a, b) {
        let eq = [
            [a[0][0], a[1][0], a[2][0], b[0]],
            [a[0][1], a[1][1], a[2][1], b[1]],
            [a[0][2], a[1][2], a[2][2], b[2]]
        ]
        return eq
    }
}



























/*
/**
 * Zobrazí vektor na rovinu XY, ale zachová jeho délku
 * @param {Vector3D} vector 
 
export function ProjectVectorToXY(vector) {
    let orgLen = vector.getMagnitude()

    // Vytvořé normalizovaný vektor projekce, bude pak vynásoben skalárem délky vstupního vektoru
    let XYvector = new Vector3D(vector.x, vector.y, 0)
    XYvector.normalize()

    XYvector.scale(orgLen)
    return XYvector
}

export class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export function Vector2DFromArray(a) {
    return new Vector2D(a[0], a[1])
}
*/